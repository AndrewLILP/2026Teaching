// Recommended filename: JournalThumbnail.cs
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public class JournalThumbnail : MonoBehaviour, ISelectHandler
{
    [SerializeField] private RawImage image;

    public JournalEntry Entry { get; private set; }
    public Texture2D Texture { get; private set; }

    private JournalScreen screen;

    public void Setup(JournalEntry entry, JournalScreen owner)
    {
        Entry = entry;
        screen = owner;
        image.texture = null;            // grey until the photo loads
    }

    public void SetTexture(Texture2D texture)
    {
        Texture = texture;
        image.texture = texture;
    }

    // Runs when this thumbnail is selected by mouse, keyboard or gamepad.
    public void OnSelect(BaseEventData eventData)
    {
        screen.ShowDetail(this);
        screen.KeepVisible((RectTransform)transform);   // gamepad users can't scroll by hand
    }
}
