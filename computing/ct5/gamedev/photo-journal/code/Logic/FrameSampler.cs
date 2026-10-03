// Recommended filename: FrameSampler.cs   (folder: Assets/PhotoJournal/Logic)

// The Lesson 10 circular buffer, moved into its own class so it can be tested.
public class FrameSampler
{
    private readonly float[] samples;
    private int index;
    private int count;

    public FrameSampler(int size)
    {
        samples = new float[size];
    }

    public int Count => count;

    public void Add(float frameTime)
    {
        samples[index] = frameTime;
        index = (index + 1) % samples.Length;
        if (count < samples.Length) count++;
    }

    public float Average
    {
        get
        {
            if (count == 0) return 0f;          // guard clause: added after a test failed
            float total = 0f;
            for (int i = 0; i < count; i++)
            {
                total += samples[i];
            }
            return total / count;
        }
    }

    public float Worst
    {
        get
        {
            float worst = 0f;
            for (int i = 0; i < count; i++)
            {
                if (samples[i] > worst) worst = samples[i];
            }
            return worst;
        }
    }
}
