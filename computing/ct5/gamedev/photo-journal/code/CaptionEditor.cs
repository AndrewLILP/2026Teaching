// Recommended filename: CaptionEditor.cs
using TMPro;
using UnityEngine;

public class CaptionEditor : MonoBehaviour
{
    [SerializeField] private Journal journal;
    [SerializeField] private JournalScreen journalScreen;
    [SerializeField] private GameObject captionPanel;
    [SerializeField] private TMP_InputField inputField;

    private JournalEntry editing;

    private void Awake()
    {
        inputField.characterLimit = Journal.MaxCaptionLength;   // the data dictionary rule, again
        inputField.onSubmit.AddListener(Save);                  // Enter, or Done on a keyboard
        inputField.onEndEdit.AddListener(OnEndEdit);            // also fires for Escape or clicking away
        captionPanel.SetActive(false);
    }

    // Caption button → On Click
    public void Open()
    {
        editing = journalScreen.SelectedEntry;
        if (editing == null) return;                // guard clause: no photo selected

        journalScreen.enabled = false;              // so typing "j" can't close the journal
        captionPanel.SetActive(true);
        inputField.text = editing.caption;
        inputField.Select();
        inputField.ActivateInputField();

        RectTransform field = (RectTransform)inputField.transform;
        Platform.Current?.ShowOnScreenKeyboard(ScreenRect(field));
    }

    private void Save(string text)
    {
        if (editing == null) return;                // guard clause: already closed
        JournalEntry entry = editing;
        Close();
        journal.SetCaption(entry, text);            // JournalScreen is listening again by now
    }

    private void OnEndEdit(string text)
    {
        if (editing == null) return;                // guard clause: Save already ran
        Close();                                    // ended without submitting: cancel
    }

    private void Close()
    {
        editing = null;
        captionPanel.SetActive(false);
        journalScreen.enabled = true;
    }

    // For a Screen Space - Overlay canvas, world corners are screen pixels.
    private static Rect ScreenRect(RectTransform rect)
    {
        Vector3[] corners = new Vector3[4];         // 0 = bottom-left, 2 = top-right
        rect.GetWorldCorners(corners);
        return new Rect(corners[0].x, corners[0].y, corners[2].x - corners[0].x, corners[2].y - corners[0].y);
    }
}
