// Recommended filename: JournalScreen.cs
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem;
using UnityEngine.UI;

public class JournalScreen : MonoBehaviour
{
    [Header("Input (defaults are set when you add the component)")]
    [SerializeField] private InputAction toggleAction;
    [SerializeField] private InputAction backAction;

    [Header("Data and game")]
    [SerializeField] private Journal journal;
    [SerializeField] private PhotoModeController photoMode;
    [SerializeField] private Behaviour[] disableWhileOpen;  // movement, camera, PhotoModeController, PhotoCapture

    [Header("Grid")]
    [SerializeField] private GameObject screenRoot;         // the journal canvas
    [SerializeField] private Transform gridContent;         // ScrollRect content with a GridLayoutGroup
    [SerializeField] private JournalThumbnail thumbnailPrefab;
    [SerializeField] private GameObject emptyMessage;
    [SerializeField] private TMP_Text countText;
    [SerializeField] private int thumbnailWidth = 480;
    [SerializeField] private int thumbnailHeight = 270;

    [Header("Detail panel")]
    [SerializeField] private RawImage detailImage;
    [SerializeField] private TMP_Text captionText;
    [SerializeField] private TMP_Text locationText;
    [SerializeField] private TMP_Text dateText;

    [Header("Delete confirmation")]
    [SerializeField] private GameObject confirmPanel;
    [SerializeField] private Button confirmNoButton;

    public bool IsOpen { get; private set; }

    private readonly List<JournalThumbnail> thumbnails = new List<JournalThumbnail>();
    private JournalThumbnail selected;
    private float savedTimeScale = 1f;

    // Runs when the component is first added: fills in default controls.
    private void Reset()
    {
        toggleAction = new InputAction("ToggleJournal", InputActionType.Button);
        toggleAction.AddBinding("<Keyboard>/j");
        toggleAction.AddBinding("<Gamepad>/select");

        backAction = new InputAction("Back", InputActionType.Button);
        backAction.AddBinding("<Keyboard>/escape");
        backAction.AddBinding("<Gamepad>/buttonEast");
    }

    private void OnEnable()
    {
        toggleAction.performed += OnToggle;
        backAction.performed += OnBack;
        toggleAction.Enable();
        backAction.Enable();
        journal.JournalChanged += OnJournalChanged;
    }

    private void OnDisable()
    {
        toggleAction.performed -= OnToggle;
        backAction.performed -= OnBack;
        toggleAction.Disable();
        backAction.Disable();
        journal.JournalChanged -= OnJournalChanged;
    }

    private void OnToggle(InputAction.CallbackContext context)
    {
        if (IsOpen) Close();
        else Open();
    }

    private void OnBack(InputAction.CallbackContext context)
    {
        if (!IsOpen) return;                        // guard clause: nothing to go back from
        if (confirmPanel.activeSelf) CancelDelete(); // back out of the question first
        else Close();
    }

    private void Open()
    {
        if (photoMode != null && photoMode.IsActive) return;   // guard clause: finish photo mode first

        IsOpen = true;
        foreach (Behaviour script in disableWhileOpen)
        {
            script.enabled = false;
        }
        savedTimeScale = Time.timeScale;
        Time.timeScale = 0f;

        screenRoot.SetActive(true);
        confirmPanel.SetActive(false);
        StartCoroutine(BuildGrid());
    }

    private void Close()
    {
        StopAllCoroutines();
        ClearGrid();
        screenRoot.SetActive(false);

        Time.timeScale = savedTimeScale;
        foreach (Behaviour script in disableWhileOpen)
        {
            script.enabled = true;
        }
        IsOpen = false;
    }

    private void OnJournalChanged()
    {
        if (!IsOpen) return;                        // guard clause
        StopAllCoroutines();
        StartCoroutine(BuildGrid());
    }

    private IEnumerator BuildGrid()
    {
        ClearGrid();

        int count = journal.Entries.Count;
        countText.text = count == 1 ? "1 photo" : count + " photos";
        emptyMessage.SetActive(count == 0);
        if (count == 0)
        {
            ShowDetail(null);
            yield break;
        }

        // 1. Make every button now, newest first, so the layout appears at once.
        for (int i = count - 1; i >= 0; i--)
        {
            JournalThumbnail thumb = Instantiate(thumbnailPrefab, gridContent);
            thumb.Setup(journal.Entries[i], this);
            thumbnails.Add(thumb);
        }
        EventSystem.current.SetSelectedGameObject(thumbnails[0].gameObject);

        // 2. Load one photo per frame, so the screen never freezes.
        foreach (JournalThumbnail thumb in thumbnails)
        {
            thumb.SetTexture(LoadThumbnail(thumb.Entry));
            if (thumb == selected) detailImage.texture = thumb.Texture;
            yield return null;
        }
    }

    private void ClearGrid()
    {
        foreach (JournalThumbnail thumb in thumbnails)
        {
            if (thumb.Texture != null) Destroy(thumb.Texture);   // free its memory
            Destroy(thumb.gameObject);
        }
        thumbnails.Clear();
        selected = null;
        detailImage.texture = null;
    }

    private Texture2D LoadThumbnail(JournalEntry entry)
    {
        string path = Path.Combine(journal.PhotoFolder, entry.fileName);
        if (!File.Exists(path)) return null;        // guard clause

        Texture2D full = new Texture2D(2, 2);
        full.LoadImage(File.ReadAllBytes(path));    // decodes the PNG and resizes to fit
        Texture2D thumb = Shrink(full, thumbnailWidth, thumbnailHeight);
        Destroy(full);                              // keep only the small copy
        return thumb;
    }

    private static Texture2D Shrink(Texture2D source, int width, int height)
    {
        RenderTexture temp = RenderTexture.GetTemporary(width, height);
        Graphics.Blit(source, temp);                // GPU draws the photo at the new size

        RenderTexture previous = RenderTexture.active;
        RenderTexture.active = temp;
        Texture2D small = new Texture2D(width, height, TextureFormat.RGB24, false);
        small.ReadPixels(new Rect(0, 0, width, height), 0, 0);
        small.Apply();

        RenderTexture.active = previous;
        RenderTexture.ReleaseTemporary(temp);
        return small;
    }

    public void ShowDetail(JournalThumbnail thumb)
    {
        selected = thumb;
        if (thumb == null)
        {
            detailImage.texture = null;
            captionText.text = "";
            locationText.text = "";
            dateText.text = "";
            return;
        }

        JournalEntry entry = thumb.Entry;
        detailImage.texture = thumb.Texture;
        captionText.text = string.IsNullOrEmpty(entry.caption) ? "No caption yet" : entry.caption;
        locationText.text = entry.locationName;

        // Saved in one fixed format, shown in the player's own format.
        if (DateTime.TryParseExact(entry.timestamp, "yyyy-MM-ddTHH:mm:ss",
                CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime taken))
        {
            dateText.text = taken.ToString("g", CultureInfo.CurrentCulture);   // e.g. 2/10/2026 2:30 PM in Australia
        }
        else
        {
            dateText.text = "Unknown date";
        }
    }

    // Delete button: ask first.
    public void RequestDelete()
    {
        if (selected == null) return;               // guard clause
        confirmPanel.SetActive(true);
        EventSystem.current.SetSelectedGameObject(confirmNoButton.gameObject);  // safe default
    }

    // "Yes, delete" button.
    public void ConfirmDelete()
    {
        confirmPanel.SetActive(false);
        if (selected == null) return;               // guard clause
        journal.DeleteEntry(selected.Entry);        // raises JournalChanged, which rebuilds the grid
    }

    // "No, keep it" button.
    public void CancelDelete()
    {
        confirmPanel.SetActive(false);
        if (selected != null) EventSystem.current.SetSelectedGameObject(selected.gameObject);
    }
}