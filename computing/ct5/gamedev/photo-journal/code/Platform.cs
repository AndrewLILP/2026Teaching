// Recommended filename: Platform.cs
using UnityEngine;

// The one place every script asks for "the current platform".
public static class Platform
{
    public static IPlatformService Current { get; private set; }

    public static void Register(IPlatformService service)
    {
        if (Current != null) return;        // guard clause: the first platform to register wins
        Current = service;
        Debug.Log("Platform services: " + service.Name);
    }

    // Clears the old value each time Play is pressed, even if the Editor skips reloading scripts.
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
    private static void ResetForPlayMode()
    {
        Current = null;
    }
}
