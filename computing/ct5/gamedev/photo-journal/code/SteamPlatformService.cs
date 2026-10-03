// Recommended filename: SteamPlatformService.cs
// Only compiles when Steamworks.NET is installed. Without it, this whole file is skipped
// and the mock takes over, so the project still builds on computers without Steam.
#if STEAMWORKS_NET && !DISABLESTEAMWORKS
using System;
using Steamworks;
using UnityEngine;

[DefaultExecutionOrder(-100)]                   // tries before the mock (-50)
public class SteamPlatformService : MonoBehaviour, IPlatformService
{
    public string Name => "Steam (App ID 480)";

    private bool initialised;

    private void Awake()
    {
        try
        {
            initialised = SteamAPI.Init();      // false if the Steam client isn't running
        }
        catch (DllNotFoundException)
        {
            initialised = false;                // Steam's library file is missing
        }

        if (!initialised)                       // guard clause: leave it to the mock
        {
            Debug.Log("Steam not available, so the mock will be used.");
            enabled = false;
            return;
        }
        Platform.Register(this);
    }

    private void Update()
    {
        SteamAPI.RunCallbacks();                // lets Steam deliver its messages each frame
    }

    private void OnApplicationQuit()
    {
        if (initialised) SteamAPI.Shutdown();
    }

    public bool IsUnlocked(string achievementId)
    {
        AchievementInfo info = Achievements.Find(achievementId);
        if (info == null) return false;         // guard clause: not in the table

        SteamUserStats.GetAchievement(info.spacewarId, out bool achieved);
        return achieved;
    }

    public void UnlockAchievement(string achievementId)
    {
        if (IsUnlocked(achievementId)) return;  // guard clause: unlock once only

        AchievementInfo info = Achievements.Find(achievementId);
        if (info == null) return;               // guard clause

        SteamUserStats.SetAchievement(info.spacewarId);     // Steam's name comes from the table
        SteamUserStats.StoreStats();                        // upload it, and show Steam's pop-up
    }

    public void AddScreenshot(string filePath, string locationName)
    {
        // null thumbnail: Steam makes its own. The size is the screen the photo was taken from.
        ScreenshotHandle handle = SteamScreenshots.AddScreenshotToLibrary(filePath, null, Screen.width, Screen.height);
        SteamScreenshots.SetLocation(handle, locationName);
    }

    public bool ShowOnScreenKeyboard(Rect screenArea)
    {
        if (!SteamUtils.IsSteamRunningOnSteamDeck()) return false;   // guard clause: PCs have keyboards

        // Unity measures y from the bottom of the screen; Steam measures from the top.
        int topY = Screen.height - (int)(screenArea.y + screenArea.height);
        return SteamUtils.ShowFloatingGamepadTextInput(
            EFloatingGamepadTextInputMode.k_EFloatingGamepadTextInputModeModeSingleLine,
            (int)screenArea.x, topY, (int)screenArea.width, (int)screenArea.height);
    }
}
#endif
