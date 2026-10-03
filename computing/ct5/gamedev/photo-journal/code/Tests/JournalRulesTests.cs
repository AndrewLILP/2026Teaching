// Recommended filename: JournalRulesTests.cs   (folder: Assets/PhotoJournal/Tests)
using System.Collections.Generic;
using NUnit.Framework;

public class JournalRulesTests
{
    // ---------- CleanCaption ----------

    [Test]
    public void CleanCaption_NormalText_IsUnchanged()
    {
        // Arrange
        string input = "Fog over the valley";
        // Act
        string result = JournalRules.CleanCaption(input);
        // Assert
        Assert.AreEqual("Fog over the valley", result);
    }

    [Test]
    public void CleanCaption_SpacesAtEnds_AreTrimmed()
    {
        Assert.AreEqual("Summit", JournalRules.CleanCaption("   Summit  "));
    }

    [Test]
    public void CleanCaption_Exactly60_IsKept()
    {
        string sixty = new string('a', 60);
        Assert.AreEqual(60, JournalRules.CleanCaption(sixty).Length);
    }

    [Test]
    public void CleanCaption_61_IsCutTo60()
    {
        string sixtyOne = new string('a', 61);
        Assert.AreEqual(60, JournalRules.CleanCaption(sixtyOne).Length);
    }

    [Test]
    public void CleanCaption_Empty_StaysEmpty()
    {
        Assert.AreEqual("", JournalRules.CleanCaption(""));
    }

    [Test]
    public void CleanCaption_Null_BecomesEmpty()
    {
        Assert.AreEqual("", JournalRules.CleanCaption(null));
    }

    // ---------- CountPlaces ----------

    [Test]
    public void CountPlaces_RepeatedPlace_CountedOnce()
    {
        var names = new List<string> { "Lookout Point", "Creek Crossing", "Lookout Point", "Summit" };
        Assert.AreEqual(3, JournalRules.CountPlaces(names));
    }

    [Test]
    public void CountPlaces_EmptyJournal_IsZero()
    {
        Assert.AreEqual(0, JournalRules.CountPlaces(new List<string>()));
    }

    [Test]
    public void CountPlaces_DifferentCapitals_CountAsDifferent()
    {
        // Documents current behaviour. Is this what we want? See the Extension task.
        var names = new List<string> { "Summit", "summit" };
        Assert.AreEqual(2, JournalRules.CountPlaces(names));
    }

    // ---------- MakeUniqueFileName ----------

    [Test]
    public void MakeUniqueFileName_NoClash_UsesBaseName()
    {
        string result = JournalRules.MakeUniqueFileName("photo_20261002_143012", name => false);
        Assert.AreEqual("photo_20261002_143012.png", result);
    }

    [Test]
    public void MakeUniqueFileName_TwoExist_AddsThree()
    {
        var existing = new List<string> { "photo_20261002_143012.png", "photo_20261002_143012_2.png" };
        string result = JournalRules.MakeUniqueFileName("photo_20261002_143012", existing.Contains);
        Assert.AreEqual("photo_20261002_143012_3.png", result);
    }

    // ---------- FrameSampler ----------

    [Test]
    public void FrameSampler_Lesson10DeskCheck_MatchesByHand()
    {
        var sampler = new FrameSampler(4);
        foreach (float ms in new float[] { 20, 20, 40, 20, 60 }) sampler.Add(ms);
        Assert.AreEqual(35f, sampler.Average);
        Assert.AreEqual(60f, sampler.Worst);
    }

    [Test]
    public void FrameSampler_Empty_AverageIsZero()
    {
        var sampler = new FrameSampler(4);
        Assert.AreEqual(0f, sampler.Average);
    }

    [Test]
    public void FrameSampler_CountStopsAtSize()
    {
        var sampler = new FrameSampler(4);
        for (int i = 0; i < 10; i++) sampler.Add(16f);
        Assert.AreEqual(4, sampler.Count);
    }
}
