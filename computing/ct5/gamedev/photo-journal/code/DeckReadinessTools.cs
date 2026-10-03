// Recommended filename: DeckReadinessTools.cs
// Developer tools for Lesson 10. F3 shows performance; F4 audits text sizes.
using TMPro;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.Profiling;

public class DeckReadinessTools : MonoBehaviour
{
    [Header("Performance readout (F3)")]
    [SerializeField] private TMP_Text readout;
    [SerializeField] private float targetFps = 30f;

    [Header("Text audit (F4)")]
    [SerializeField] private float minTextSize = 24f;   // our design rule at 1280 × 800

    private readonly FrameSampler sampler = new FrameSampler(60);   // tested in JournalRulesTests
    private bool visible;

    private void Awake()
    {
        readout.gameObject.SetActive(false);
    }

    private void Update()
    {
        sampler.Add(Time.unscaledDeltaTime);

        Keyboard keyboard = Keyboard.current;
        if (keyboard != null && keyboard.f3Key.wasPressedThisFrame)
        {
            visible = !visible;
            readout.gameObject.SetActive(visible);
        }
        if (keyboard != null && keyboard.f4Key.wasPressedThisFrame)
        {
            AuditTextSizes();
        }

        if (!visible) return;                           // guard clause: nothing to draw
        ShowReadout();
    }

    private void ShowReadout()
    {
        float average = sampler.Average;
        float worst = sampler.Worst;
        float fps = average > 0f ? 1f / average : 0f;
        float memoryMB = Profiler.GetTotalAllocatedMemoryLong() / 1000000f;

        readout.text = $"{fps:0} fps   avg {average * 1000f:0.0} ms   worst {worst * 1000f:0.0} ms   {memoryMB:0} MB";
        readout.color = fps >= targetFps ? Color.green : Color.red;
    }

    // Lists every TextMesh Pro text in the scene smaller than the design rule.
    private void AuditTextSizes()
    {
        int problems = 0;
        TMP_Text[] texts = FindObjectsByType<TMP_Text>(FindObjectsInactive.Include, FindObjectsSortMode.None);
        foreach (TMP_Text text in texts)
        {
            float smallest = text.enableAutoSizing ? text.fontSizeMin : text.fontSize;
            if (smallest < minTextSize)
            {
                Debug.LogWarning($"Text too small ({smallest} px): {text.name}", text);
                problems++;
            }
        }
        Debug.Log($"Text audit: checked {texts.Length} texts, {problems} below {minTextSize} px.");
    }
}
