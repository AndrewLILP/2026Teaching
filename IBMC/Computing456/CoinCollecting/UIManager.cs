using UnityEngine;
using TMPro;

public class UIManager : MonoBehaviour
{
    public static UIManager Instance;

    [Header("UI Elements")]
    public TMP_Text coinText;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        UpdateCoinUI(GameManager.Instance.GetCoinCount());
    }

    public void UpdateCoinUI(int amount)
    {
        coinText.text = "Coins: " + amount;
    }
}

