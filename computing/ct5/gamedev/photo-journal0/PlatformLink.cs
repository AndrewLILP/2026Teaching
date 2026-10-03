// Recommended filename: PlatformLink.cs
using System.Collections.Generic;
using System.IO;
using UnityEngine;

// Connects the journal to whichever platform is running. It never needs to know which one.
public class PlatformLink : MonoBehaviour
{
    [SerializeField] private Journal journal;
    [SerializeField] private int placesNeeded = 3;

    private int lastCount;

    private void Start()
    {
        lastCount = journal.Entries.Count;
        journal.JournalChanged += OnJournalChanged;
        CheckAchievements();                    // counts progress made before achievements existed
    }

    private void OnDestroy()
    {
        journal.JournalChanged -= OnJournalChanged;
    }

    private void OnJournalChanged()
    {
        if (Platform.Current == null) return;   // guard clause: no platform registered

        int count = journal.Entries.Count;
        if (count > lastCount)                  // a photo was added, not deleted
        {
            JournalEntry newest = journal.Entries[count - 1];
            string path = Path.Combine(journal.PhotoFolder, newest.fileName);
            Platform.Current.AddScreenshot(path, newest.locationName);
        }
        lastCount = count;
        CheckAchievements();
    }

    private void CheckAchievements()
    {
        if (Platform.Current == null) return;   // guard clause

        if (journal.Entries.Count >= 1) Platform.Current.UnlockAchievement(Achievements.FirstPhoto);
        if (CountPlaces() >= placesNeeded) Platform.Current.UnlockAchievement(Achievements.ThreeTrails);
        if (journal.IsFull) Platform.Current.UnlockAchievement(Achievements.FullJournal);
    }

    // Counts how many different location names appear in the journal.
    private int CountPlaces()
    {
        List<string> places = new List<string>();
        foreach (JournalEntry entry in journal.Entries)
        {
            if (!places.Contains(entry.locationName))
            {
                places.Add(entry.locationName);
            }
        }
        return places.Count;
    }
}