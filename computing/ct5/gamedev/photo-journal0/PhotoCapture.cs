// Recommended filename: PhotoCapture.cs
using System;
using System.Collections;
using System.IO;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.UI;

public class PhotoCapture : MonoBehaviour
{
    [Header("Input (defaults are set when you add the component)")]
    [SerializeField] private InputAction captureAction;

    [Header("Scene references")]
    [SerializeField] private PhotoModeController photoMode;
    [SerializeField] private Journal journal;
    [SerializeField] private GameObject journalFullMessage; // hidden "Journal full" text
    [SerializeField] private GameObject photoModeOverlay;   // button prompts shown in photo mode
    [SerializeField] private AudioSource shutterSound;
    [SerializeField] private Image flashImage;              // full-screen white Image on its own canvas

    [Header("Feedback")]
    [SerializeField] private float flashDuration = 0.25f;   // seconds

    // Lesson 5's journal listens for this.
    public event Action<string> PhotoSaved;

    private bool isCapturing;
    private string photoFolder;

    // Runs when the component is first added: fills in default controls.
    private void Reset()
    {
        captureAction = new InputAction("Capture", InputActionType.Button);
        captureAction.AddBinding("<Keyboard>/space");
        captureAction.AddBinding("<Gamepad>/buttonSouth");
    }

    private void Awake()
    {
        photoFolder = Path.Combine(Application.persistentDataPath, "Journal");
        Directory.CreateDirectory(photoFolder);     // does nothing if it already exists
        Debug.Log("Photos are saved to: " + photoFolder);
    }

    private void OnEnable()
    {
        captureAction.performed += OnCapture;
        captureAction.Enable();
    }

    private void OnDisable()
    {
        captureAction.performed -= OnCapture;
        captureAction.Disable();
    }

    // Keeps the photo mode prompts in step with photo mode.
    private void Update()
    {
        if (photoModeOverlay == null || isCapturing) return;   // guard clause
        photoModeOverlay.SetActive(photoMode.IsActive);
    }

    private void OnCapture(InputAction.CallbackContext context)
    {
        if (!photoMode.IsActive) return;     // guard clause: not in photo mode
        if (isCapturing) return;             // guard clause: already taking a photo
        if (journal != null && journal.IsFull)   // guard clause: no room left
        {
            StartCoroutine(ShowFullMessage());
            return;
        }
        StartCoroutine(CaptureRoutine());
    }

    private IEnumerator ShowFullMessage()
    {
        if (journalFullMessage == null) yield break;   // guard clause
        journalFullMessage.SetActive(true);
        yield return new WaitForSecondsRealtime(2f);   // real seconds: the world is frozen
        journalFullMessage.SetActive(false);
    }

    private IEnumerator CaptureRoutine()
    {
        isCapturing = true;
        if (photoModeOverlay != null) photoModeOverlay.SetActive(false);

        yield return new WaitForEndOfFrame();       // wait until the frame is fully drawn

        Texture2D shot = ScreenCapture.CaptureScreenshotAsTexture();
        byte[] png = shot.EncodeToPNG();
        Destroy(shot);                              // free the texture's memory

        string fileName = MakeUniqueFileName();
        File.WriteAllBytes(Path.Combine(photoFolder, fileName), png);

        if (shutterSound != null) shutterSound.Play();
        yield return Flash();

        PhotoSaved?.Invoke(fileName);
        isCapturing = false;
    }

    private string MakeUniqueFileName()
    {
        string baseName = "photo_" + DateTime.Now.ToString("yyyyMMdd_HHmmss");
        string fileName = baseName + ".png";
        int copy = 2;
        while (File.Exists(Path.Combine(photoFolder, fileName)))   // same second? add a number
        {
            fileName = baseName + "_" + copy + ".png";
            copy++;
        }
        return fileName;
    }

    private IEnumerator Flash()
    {
        if (flashImage == null) yield break;        // guard clause

        float elapsed = 0f;
        while (elapsed < flashDuration)
        {
            elapsed += Time.unscaledDeltaTime;      // real time: the world is frozen
            float alpha = 1f - (elapsed / flashDuration);
            flashImage.color = new Color(1f, 1f, 1f, alpha);
            yield return null;                      // wait one frame
        }
        flashImage.color = new Color(1f, 1f, 1f, 0f);
    }
}