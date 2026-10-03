// Recommended filename: Journal.cs
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using UnityEngine;

[Serializable]
public class JournalEntry
{
    public string fileName;
    public string caption;
    public string locationName;
    public string timestamp;
}

// JsonUtility can't save a List on its own, so it goes inside a wrapper class.
[Serializable]
public class JournalData
{
    public List<JournalEntry> entries = new List<JournalEntry>();
}

public class Journal : MonoBehaviour
{
    [SerializeField] private PhotoCapture photoCapture;
    [SerializeField] private int maxPhotos = 50;

    // Lesson 6's journal screen listens for this.
    public event Action JournalChanged;

    public IReadOnlyList<JournalEntry> Entries => data.entries;
    public bool IsFull => data.entries.Count >= maxPhotos;
    public string PhotoFolder => photoFolder;

    private JournalData data = new JournalData();
    private string currentLocation = "Unknown trail";
    private string photoFolder;
    private string savePath;
    private string tempPath;

    private void Awake()
    {
        photoFolder = Path.Combine(Application.persistentDataPath, "Journal");
        Directory.CreateDirectory(photoFolder);
        savePath = Path.Combine(photoFolder, "journal.json");
        tempPath = savePath + ".tmp";
        Load();
    }

    private void OnEnable()
    {
        photoCapture.PhotoSaved += OnPhotoSaved;
    }

    private void OnDisable()
    {
        photoCapture.PhotoSaved -= OnPhotoSaved;
    }

    // A second hook: location zones in your world call this.
    public void SetLocation(string locationName)
    {
        currentLocation = locationName;
    }

    private void OnPhotoSaved(string fileName)
    {
        JournalEntry entry = new JournalEntry
        {
            fileName = fileName,
            caption = "",
            locationName = currentLocation,
            timestamp = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture)
        };
        data.entries.Add(entry);
        Save();
        JournalChanged?.Invoke();
    }

    public void DeleteEntry(JournalEntry entry)
    {
        if (!data.entries.Contains(entry)) return;      // guard clause

        string photoPath = Path.Combine(photoFolder, entry.fileName);
        if (File.Exists(photoPath)) File.Delete(photoPath);
        data.entries.Remove(entry);
        Save();
        JournalChanged?.Invoke();
    }

    private void Save()
    {
        string json = JsonUtility.ToJson(data, true);
        File.WriteAllText(tempPath, json);                  // 1. write the new version beside the old one
        if (File.Exists(savePath)) File.Delete(savePath);   // 2. remove the old version
        File.Move(tempPath, savePath);                      // 3. rename the new version into place
    }

    private void Load()
    {
        string path = savePath;
        if (!File.Exists(path))
        {
            if (!File.Exists(tempPath)) return;     // guard clause: first time playing
            path = tempPath;                        // recover from an interrupted save
        }

        try
        {
            data = JsonUtility.FromJson<JournalData>(File.ReadAllText(path)) ?? new JournalData();
        }
        catch (ArgumentException)
        {
            Debug.LogWarning("journal.json was damaged, so the journal is starting empty.");
            data = new JournalData();
            return;
        }

        RemoveMissingPhotos();
        Save();                                     // tidy up: one clean, valid save file
    }

    private void RemoveMissingPhotos()
    {
        for (int i = data.entries.Count - 1; i >= 0; i--)   // count backwards when removing
        {
            string photoPath = Path.Combine(photoFolder, data.entries[i].fileName);
            if (!File.Exists(photoPath))
            {
                data.entries.RemoveAt(i);
            }
        }
    }
}