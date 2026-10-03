// Recommended filename: PhotoModeController.cs
using UnityEngine;
using UnityEngine.InputSystem;

public class PhotoModeController : MonoBehaviour
{
    [Header("Input (defaults are set when you add the component)")]
    [SerializeField] private InputAction toggleAction;
    [SerializeField] private InputAction moveAction;
    [SerializeField] private InputAction lookAction;

    [Header("Scene references")]
    [SerializeField] private Transform cameraTransform;   // your main camera
    [SerializeField] private Transform pivot;             // an empty object at the hiker's head
    [SerializeField] private GameObject hud;              // your HUD canvas
    [SerializeField] private Behaviour[] disableWhileActive; // movement and camera-follow scripts

    [Header("Camera limits")]
    [SerializeField] private float maxDistance = 4f;      // metres from the pivot
    [SerializeField] private float moveSpeed = 2f;        // metres per second
    [SerializeField] private float lookSpeed = 90f;       // degrees per second
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

    // Runs when the component is first added: fills in default controls.
    private void Reset()
    {
        toggleAction = new InputAction("TogglePhotoMode", InputActionType.Button);
        toggleAction.AddBinding("<Keyboard>/p");
        toggleAction.AddBinding("<Gamepad>/buttonNorth");

        moveAction = new InputAction("PhotoMove", InputActionType.Value, expectedControlType: "Vector2");
        moveAction.AddCompositeBinding("2DVector")
            .With("Up", "<Keyboard>/w")
            .With("Down", "<Keyboard>/s")
            .With("Left", "<Keyboard>/a")
            .With("Right", "<Keyboard>/d");
        moveAction.AddBinding("<Gamepad>/leftStick");

        lookAction = new InputAction("PhotoLook", InputActionType.Value, expectedControlType: "Vector2");
        lookAction.AddBinding("<Gamepad>/rightStick");
        lookAction.AddCompositeBinding("2DVector")
            .With("Up", "<Keyboard>/upArrow")
            .With("Down", "<Keyboard>/downArrow")
            .With("Left", "<Keyboard>/leftArrow")
            .With("Right", "<Keyboard>/rightArrow");
    }

    private void OnEnable()
    {
        toggleAction.performed += OnToggle;
        toggleAction.Enable();
        moveAction.Enable();
        lookAction.Enable();
    }

    private void OnDisable()
    {
        toggleAction.performed -= OnToggle;
        toggleAction.Disable();
        moveAction.Disable();
        lookAction.Disable();
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
    }

    private void ExitPhotoMode()
    {
        IsActive = false;
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

        Vector2 look = lookAction.ReadValue<Vector2>();
        yaw += look.x * lookSpeed * dt;
        pitch -= look.y * lookSpeed * dt;
        pitch = Mathf.Clamp(pitch, minPitch, maxPitch);
        Quaternion rotation = Quaternion.Euler(pitch, yaw, 0f);

        Vector2 move = moveAction.ReadValue<Vector2>();
        Vector3 step = rotation * new Vector3(move.x, 0f, move.y) * moveSpeed * dt;
        offset = Vector3.ClampMagnitude(offset + step, maxDistance);

        cameraTransform.SetPositionAndRotation(pivot.position + offset, rotation);
    }

    private static float NormaliseAngle(float angle)
    {
        return angle > 180f ? angle - 360f : angle;
    }
}