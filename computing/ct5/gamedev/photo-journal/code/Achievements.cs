// Recommended filename: Achievements.cs

// One row of the achievement table.
public class AchievementInfo
{
    public readonly string id;
    public readonly string title;
    public readonly string description;
    public readonly string spacewarId;      // used by the Steam version in Lesson 9

    public AchievementInfo(string id, string title, string description, string spacewarId)
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.spacewarId = spacewarId;
    }
}

// The achievement table: the single source of truth for every achievement.
public static class Achievements
{
    public const string FirstPhoto = "FIRST_PHOTO";
    public const string ThreeTrails = "THREE_TRAILS";
    public const string FullJournal = "FULL_JOURNAL";

    public static readonly AchievementInfo[] All =
    {
        new AchievementInfo(FirstPhoto,  "Say Cheese",        "Take your first photo",              "ACH_WIN_ONE_GAME"),
        new AchievementInfo(ThreeTrails, "Trail Collector",   "Take photos in 3 different places",  "ACH_TRAVEL_FAR_ACCUM"),
        new AchievementInfo(FullJournal, "Every Page Filled", "Fill your journal",                  "ACH_WIN_100_GAMES"),
    };

    // Linear search: check each row until the id matches.
    public static AchievementInfo Find(string id)
    {
        foreach (AchievementInfo info in All)
        {
            if (info.id == id) return info;
        }
        return null;
    }
}
