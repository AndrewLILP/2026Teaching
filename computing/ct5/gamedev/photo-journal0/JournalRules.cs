// Recommended filename: JournalRules.cs   (folder: Assets/PhotoJournal/Logic)
using System;
using System.Collections.Generic;

// Pure logic: no Unity, no files, no screen. Same input, same output, every time.
// That makes every method here easy to test automatically.
public static class JournalRules
{
    public const int MaxCaptionLength = 60;     // from the Lesson 2 data dictionary

    public static string CleanCaption(string caption)
    {
        caption = (caption ?? "").Trim();
        if (caption.Length > MaxCaptionLength)
        {
            caption = caption.Substring(0, MaxCaptionLength);
        }
        return caption;
    }

    public static int CountPlaces(IEnumerable<string> locationNames)
    {
        List<string> places = new List<string>();
        foreach (string name in locationNames)
        {
            if (!places.Contains(name))
            {
                places.Add(name);
            }
        }
        return places.Count;
    }

    // "exists" is passed in, so a test can pretend which files exist.
    public static string MakeUniqueFileName(string baseName, Func<string, bool> exists)
    {
        string fileName = baseName + ".png";
        int copy = 2;
        while (exists(fileName))
        {
            fileName = baseName + "_" + copy + ".png";
            copy++;
        }
        return fileName;
    }
}