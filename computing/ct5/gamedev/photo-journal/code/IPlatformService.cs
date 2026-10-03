// Recommended filename: IPlatformService.cs
// The contract: what any platform (Steam, a mock, a future console) must be able to do.
public interface IPlatformService
{
    string Name { get; }
    bool IsUnlocked(string achievementId);
    void UnlockAchievement(string achievementId);
    void AddScreenshot(string filePath, string locationName);
    bool ShowOnScreenKeyboard(UnityEngine.Rect screenArea);   // added in Lesson 9
}
