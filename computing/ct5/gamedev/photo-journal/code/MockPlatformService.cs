// Recommended filename: MockPlatformService.cs
using System.Collections;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEngine;

[DefaultExecutionOrder(-50)]                // registers before other scripts start
public class MockPlatformService : MonoBehaviour, IPlatformService
{
    [Header("Achievement pop-up (on its own canvas)")]
    [SerializeField] private GameObject toastPanel;
    [SerializeField] private TMP_Text toastTitle;
    [SerializeField] private TMP_Text toastDescription;
    [SerializeField] private float toastSeconds = 3f;

    public string Name => "Mock (no Steam)";

    private readonly Queue<AchievementInfo> toastQueue = new Queue<AchievementInfo>();
    private bool showingToasts;

    private void Awake()
    {
        Platform.Register(this);
        toastPanel.SetActive(false);
    }

    public bool IsUnlocked(string achievementId)
    {
        return PlayerPrefs.GetInt("mock_ach_" + achievementId, 0) == 1;
    }

    public void UnlockAchievement(string achievementId)
    {
        if (IsUnlocked(achievementId)) return;              // guard clause: unlock once only

        AchievementInfo info = Achievements.Find(achievementId);
        if (info == null)                                   // guard clause: not in the table
        {
            Debug.LogWarning("Unknown achievement: " + achievementId);
            return;
        }

        PlayerPrefs.SetInt("mock_ach_" + achievementId, 1);
        PlayerPrefs.Save();

        toastQueue.Enqueue(info);                           // join the back of the queue
        if (!showingToasts) StartCoroutine(ShowToasts());
    }

    public void AddScreenshot(string filePath, string locationName)
    {
        Debug.Log("[Mock] Screenshot added: " + Path.GetFileName(filePath) + " at " + locationName);
    }

    // A PC player has a real keyboard, so the mock never needs to show one.
    public bool ShowOnScreenKeyboard(Rect screenArea)
    {
        Debug.Log("[Mock] On-screen keyboard not needed on this computer.");
        return false;
    }

    private IEnumerator ShowToasts()
    {
        showingToasts = true;
        while (toastQueue.Count > 0)
        {
            AchievementInfo info = toastQueue.Dequeue();    // take from the front
            toastTitle.text = "Achievement unlocked: " + info.title;
            toastDescription.text = info.description;
            toastPanel.SetActive(true);
            yield return new WaitForSecondsRealtime(toastSeconds);
            toastPanel.SetActive(false);
            yield return new WaitForSecondsRealtime(0.3f);  // short gap between pop-ups
        }
        showingToasts = false;
    }

    // Right-click the component's title in the Inspector to test achievements again.
    [ContextMenu("Reset mock achievements")]
    private void ResetMockAchievements()
    {
        foreach (AchievementInfo info in Achievements.All)
        {
            PlayerPrefs.DeleteKey("mock_ach_" + info.id);
        }
        Debug.Log("[Mock] Achievements reset.");
    }
}
