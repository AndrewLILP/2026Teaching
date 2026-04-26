using UnityEngine;

public class PlayerCoinCollector : MonoBehaviour
{
    public int currentCoins = 0;

    public void AddCoins(int amount)
    {
        currentCoins += amount;

        // Notify GameManager
        GameManager.Instance.UpdateCoinCount(currentCoins);
    }
}

