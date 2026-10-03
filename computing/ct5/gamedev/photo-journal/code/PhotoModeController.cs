// Recommended filename: PhotoModeController.cs
using UnityEngine;
using UnityEngine.InputSystem;

public class PhotoModeController : MonoBehaviour
{
    [Header("Input (from the PhotoJournalControls asset)")]
    [SerializeField] private InputActionReference toggleAction;
    [SerializeField] private InputActionReference moveAction;
    [SerializeField] private InputActionReference lookAction;

    [Header("Scene references")]
    [SerializeField] private Transform cameraTransform;   // your main camera
    [SerializeField] private Transform pivot;             // an empty object at the hiker's head
    [SerializeField] private GameObject hud;              // your HUD canvas
    [SerializeField] private Behaviour[] disableWhileActive; // movement and camera-follow scripts

    [Header("Camera limits")]
    [SerializeField] private float maxDistance = 4f;      // metres from the pivot
    [SerializeField] private float moveSpeed = 2f;        // metres per second
    [SerializeField] private float lookSpeed = 90f;       // stick: degrees per second
    [SerializeField] private float mouseSensitivity = 0.1f; // mouse: degrees per pixel moved
    [SerializeField] private float minPitch = -60f;
    [SerializeField] private float maxPitch = 70f;

    public bool IsActive { get; private set; }

    private bool isAvailable;
    private Vector3 offset;
    private float yaw;
    private float pitch;
    private Vector3 savedPosition;
    private Quaternion savedRotation;
    private float savedTimeScale = 1f;
    private CursorLockMode savedCursorLock;

    private void OnEnable()
    {
        toggleAction.action.performed += OnToggle;
        toggleAction.action.Enable();
        moveAction.action.Enable();
        lookAction.action.Enable();
    }

    private void OnDisable()
    {
        toggleAction.action.performed -= OnToggle;
        toggleAction.action.Disable();
        moveAction.action.Disable();
        lookAction.action.Disable();
    }

    // THE HOOK: your own player code calls this.
    public void SetAvailable(bool available)
    {
        isAvailable = available;
        if (!isAvailable && IsActive)
        {
            ExitPhotoMode();   // forced out, e.g. a cutscene starts
        }
    }

    private void OnToggle(InputAction.CallbackContext context)
    {
        if (!isAvailable) return;            // guard clause

        if (IsActive) ExitPhotoMode();
        else EnterPhotoMode();
    }

    private void EnterPhotoMode()
    {
        IsActive = true;

        savedPosition = cameraTransform.position;
        savedRotation = cameraTransform.rotation;

        foreach (Behaviour script in disableWhileActive)
        {
            script.enabled = false;
        }
        if (hud != null) hud.SetActive(false);

        offset = Vector3.ClampMagnitude(cameraTransform.position - pivot.position, maxDistance);
        yaw = cameraTransform.eulerAngles.y;
        pitch = NormaliseAngle(cameraTransform.eulerAngles.x);

        savedTimeScale = Time.timeScale;
        Time.timeScale = 0f;                 // freeze the world

        savedCursorLock = Cursor.lockState;
        Cursor.lockState = CursorLockMode.Locked;   // the mouse turns the camera, not a pointer
    }

    private void ExitPhotoMode()
    {
        IsActive = false;
        Cursor.lockState = savedCursorLock;
        Time.timeScale = savedTimeScale;

        cameraTransform.SetPositionAndRotation(savedPosition, savedRotation);
        if (hud != null) hud.SetActive(true);

        foreach (Behaviour script in disableWhileActive)
        {
            script.enabled = true;
        }
    }

    private void LateUpdate()
    {
        if (!IsActive) return;               // guard clause

        float dt = Time.unscaledDeltaTime;   // keeps ticking while time is frozen

        Vector2 look = lookAction.action.ReadValue<Vector2>();
        bool fromMouse = lookAction.action.activeControl?.device is Mouse;
        // A mouse reports how far it moved this frame. A stick reports a steady rate.
        float lookScale = fromMouse ? mouseSensitivity : lookSpeed * dt;
        yaw += look.x * lookScale;
        pitch -= look.y * lookScale;
        pitch = Mathf.Clamp(pitch, minPitch, maxPitch);
        Quaternion rotation = Quaternion.Euler(pitch, yaw, 0f);

        Vector2 move = moveAction.action.ReadValue<Vector2>();
        Vector3 step = rotation * new Vector3(move.x, 0f, move.y) * moveSpeed * dt;
        offset = Vector3.ClampMagnitude(offset + step, maxDistance);

        cameraTransform.SetPositionAndRotation(pivot.position + offset, rotation);
    }

    private static float NormaliseAngle(float angle)
    {
        return angle > 180f ? angle - 360f : angle;
    }
}
