// Recommended filename: PromptLabel.cs
using TMPro;
using UnityEngine;

[RequireComponent(typeof(TMP_Text))]
public class PromptLabel : MonoBehaviour
{
    [SerializeField] private string keyboardText = "[Space] Capture   [P] Exit";
    [SerializeField] private string gamepadText = "[A] Capture   [Y] Exit";

    private TMP_Text label;

    private void Awake()
    {
        label = GetComponent<TMP_Text>();
    }

    private void OnEnable()
    {
        InputDeviceWatcher.DeviceChanged += Refresh;
        Refresh();
    }

    private void OnDisable()
    {
        InputDeviceWatcher.DeviceChanged -= Refresh;
    }

    private void Refresh()
    {
        label.text = InputDeviceWatcher.UsingGamepad ? gamepadText : keyboardText;
    }
}