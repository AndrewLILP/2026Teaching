using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance;

    private int totalCoins = 0;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public void UpdateCoinCount(int newAmount)
    {
        totalCoins = newAmount;

        // Update UI
        UIManager.Instance.UpdateCoinUI(totalCoins);
    }

    public int GetCoinCount()
    {
        return totalCoins;
    }
}