// Recommended filename: InputDeviceWatcher.cs
using System;
using UnityEngine;
using UnityEngine.InputSystem;

public class InputDeviceWatcher : MonoBehaviour
{
    public static bool UsingGamepad { get; private set; }
    public static event Action DeviceChanged;

    private IDisposable listener;

    private void Awake()
    {
        UsingGamepad = Gamepad.current != null;     // e.g. Steam Deck starts on gamepad prompts
    }

    private void OnEnable()
    {
        listener = InputSystem.onAnyButtonPress.Call(OnAnyButton);
    }

    private void OnDisable()
    {
        listener?.Dispose();
    }

    private void OnAnyButton(InputControl control)
    {
        bool isGamepad = control.device is Gamepad;
        if (isGamepad == UsingGamepad) return;      // guard clause: same device as before
        UsingGamepad = isGamepad;
        DeviceChanged?.Invoke();
    }
}