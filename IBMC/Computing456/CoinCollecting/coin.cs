using UnityEngine;

public class Coin : MonoBehaviour
{
    [Header("Coin Settings")]
    public float rotationSpeed = 90f;
    public int coinValue = 1;

    [Header("Effects")]
    public AudioClip pickupSound;
    public GameObject pickupVFX;

    private void Update()
    {
        transform.Rotate(Vector3.up * rotationSpeed * Time.deltaTime);
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            PlayerCoinCollector collector = other.GetComponent<PlayerCoinCollector>();

            if (collector != null)
            {
                collector.AddCoins(coinValue);
            }

            if (pickupSound)
                AudioSource.PlayClipAtPoint(pickupSound, transform.position);

            if (pickupVFX)
                Instantiate(pickupVFX, transform.position, Quaternion.identity);

            Destroy(gameObject);
        }
    }
}
