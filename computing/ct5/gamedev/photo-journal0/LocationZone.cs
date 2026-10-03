// Recommended filename: LocationZone.cs
using UnityEngine;

[RequireComponent(typeof(Collider))]
public class LocationZone : MonoBehaviour
{
    [SerializeField] private string locationName = "Lookout Point";
    [SerializeField] private Journal journal;
    [SerializeField] private string playerTag = "Player";

    private void OnTriggerEnter(Collider other)
    {
        if (!other.CompareTag(playerTag)) return;   // guard clause: only the player counts
        journal.SetLocation(locationName);
    }
}