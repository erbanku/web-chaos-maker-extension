// Get DOM elements
const colorPicker = document.getElementById("colorPicker");
const applyColorBtn = document.getElementById("applyColor");
const resetColorBtn = document.getElementById("resetColor");

const rotation2dSlider = document.getElementById("rotation2d");
const rotation2dValue = document.getElementById("rotation2dValue");

// Filter sliders
const brightnessSlider = document.getElementById("brightness");
const brightnessValue = document.getElementById("brightnessValue");
const contrastSlider = document.getElementById("contrast");
const contrastValue = document.getElementById("contrastValue");
const sepiaSlider = document.getElementById("sepia");
const sepiaValue = document.getElementById("sepiaValue");
const blurSlider = document.getElementById("blur");
const blurValue = document.getElementById("blurValue");
const grayscaleBtn = document.getElementById("toggleGrayscale");
const invertBtn = document.getElementById("toggleInvert");

// Zoom slider
const zoomSlider = document.getElementById("zoom");
const zoomValue = document.getElementById("zoomValue");

// Rotation preset buttons
const rotate90Btn = document.getElementById("rotate90");
const rotate180Btn = document.getElementById("rotate180");
const rotate270Btn = document.getElementById("rotate270");
const rotate0Btn = document.getElementById("rotate0");

const resetAllBtn = document.getElementById("resetAll");

// Fun mode buttons
const rainbowBtn = document.getElementById("rainbowMode");
const discoBtn = document.getElementById("discoMode");
const spinBtn = document.getElementById("spinMode");
const bounceBtn = document.getElementById("bounceMode");
const shakeBtn = document.getElementById("shakeMode");
const flipBtn = document.getElementById("flipMode");
const glitchBtn = document.getElementById("glitchMode");
const matrixBtn = document.getElementById("matrixMode");
const confettiBtn = document.getElementById("confettiMode");
const upsideDownBtn = document.getElementById("upsideDown");
const mirrorBtn = document.getElementById("mirrorMode");
const wobbleBtn = document.getElementById("wobbleMode");
const crazyZoomBtn = document.getElementById("crazyZoom");
const comboBtn = document.getElementById("comboMode");

// Get current site domain
async function getCurrentDomain() {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    const url = new URL(tab.url);
    return url.hostname;
}

// Helper function to send messages and save settings
async function sendMessage(action, data = {}) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { action, ...data });

    // Save settings for this domain (except for temporary fun modes)
    const persistentActions = [
        "changeBackground",
        "rotate2d",
        "resetBackground",
        "resetAll",
    ];
    if (persistentActions.includes(action)) {
        const domain = await getCurrentDomain();
        const settings = {
            action,
            data,
            timestamp: Date.now(),
        };

        const storageKey = `site_${domain}`;
        await chrome.storage.local.set({ [storageKey]: settings });
    }
}

// Load saved settings for current site
async function loadSavedSettings() {
    const domain = await getCurrentDomain();
    const storageKey = `site_${domain}`;
    const result = await chrome.storage.local.get(storageKey);

    if (result[storageKey]) {
        const settings = result[storageKey];

        // Apply saved settings
        if (settings.action === "changeBackground" && settings.data.color) {
            colorPicker.value = settings.data.color;
            sendMessage("changeBackground", settings.data);
        } else if (
            settings.action === "rotate2d" &&
            settings.data.angle !== undefined
        ) {
            rotation2dSlider.value = settings.data.angle;
            rotation2dValue.textContent = settings.data.angle;
            sendMessage("rotate2d", settings.data);
        }
    }
}

// Initialize - load saved settings when popup opens
loadSavedSettings();

// Update slider value displays
rotation2dSlider.addEventListener("input", () => {
    rotation2dValue.textContent = rotation2dSlider.value;
    sendMessage("rotate2d", { angle: rotation2dSlider.value });
});

brightnessSlider.addEventListener("input", () => {
    brightnessValue.textContent = brightnessSlider.value;
    applyFilters();
});

contrastSlider.addEventListener("input", () => {
    contrastValue.textContent = contrastSlider.value;
    applyFilters();
});

sepiaSlider.addEventListener("input", () => {
    sepiaValue.textContent = sepiaSlider.value;
    applyFilters();
});

blurSlider.addEventListener("input", () => {
    blurValue.textContent = blurSlider.value;
    applyFilters();
});

zoomSlider.addEventListener("input", () => {
    zoomValue.textContent = zoomSlider.value;
    sendMessage("zoom", { scale: zoomSlider.value / 100 });
});

// Grayscale and invert toggles
let grayscaleActive = false;
let invertActive = false;

grayscaleBtn.addEventListener("click", () => {
    grayscaleActive = !grayscaleActive;
    grayscaleBtn.classList.toggle("active");
    applyFilters();
});

invertBtn.addEventListener("click", () => {
    invertActive = !invertActive;
    invertBtn.classList.toggle("active");
    applyFilters();
});

function applyFilters() {
    const filters = {
        brightness: brightnessSlider.value,
        contrast: contrastSlider.value,
        sepia: sepiaSlider.value,
        blur: blurSlider.value,
        grayscale: grayscaleActive ? 100 : 0,
        invert: invertActive ? 100 : 0,
    };
    sendMessage("applyFilters", filters);
}

// Apply background color
applyColorBtn.addEventListener("click", async () => {
    const color = colorPicker.value;
    sendMessage("changeBackground", { color });
});

// Reset background color
resetColorBtn.addEventListener("click", async () => {
    sendMessage("resetBackground");
});

// Rotation preset buttons
rotate90Btn.addEventListener("click", () => {
    rotation2dSlider.value = 90;
    rotation2dValue.textContent = "90";
    sendMessage("rotate2d", { angle: 90 });
});

rotate180Btn.addEventListener("click", () => {
    rotation2dSlider.value = 180;
    rotation2dValue.textContent = "180";
    sendMessage("rotate2d", { angle: 180 });
});

rotate270Btn.addEventListener("click", () => {
    rotation2dSlider.value = 270;
    rotation2dValue.textContent = "270";
    sendMessage("rotate2d", { angle: 270 });
});

rotate0Btn.addEventListener("click", () => {
    rotation2dSlider.value = 0;
    rotation2dValue.textContent = "0";
    sendMessage("rotate2d", { angle: 0 });
});

// FUN MODES! 🎉 (temporary, not saved)
async function sendTemporaryMessage(action, data = {}) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { action, ...data });
}

rainbowBtn.addEventListener("click", () => sendTemporaryMessage("rainbowMode"));
discoBtn.addEventListener("click", () => sendTemporaryMessage("discoMode"));
spinBtn.addEventListener("click", () => sendTemporaryMessage("spinMode"));
bounceBtn.addEventListener("click", () => sendTemporaryMessage("bounceMode"));
shakeBtn.addEventListener("click", () => sendTemporaryMessage("shakeMode"));
flipBtn.addEventListener("click", () => sendTemporaryMessage("flipMode"));
glitchBtn.addEventListener("click", () => sendTemporaryMessage("glitchMode"));
matrixBtn.addEventListener("click", () => sendTemporaryMessage("matrixMode"));
confettiBtn.addEventListener("click", () =>
    sendTemporaryMessage("confettiMode")
);
upsideDownBtn.addEventListener("click", () =>
    sendTemporaryMessage("upsideDown")
);
mirrorBtn.addEventListener("click", () => sendTemporaryMessage("mirrorMode"));
wobbleBtn.addEventListener("click", () => sendTemporaryMessage("wobbleMode"));
crazyZoomBtn.addEventListener("click", () => sendTemporaryMessage("crazyZoom"));
comboBtn.addEventListener("click", () => sendTemporaryMessage("comboMode"));

// Reset all transformations
resetAllBtn.addEventListener("click", async () => {
    sendMessage("resetAll");

    // Reset UI controls
    rotation2dSlider.value = 0;
    rotation2dValue.textContent = "0";
    colorPicker.value = "#ffffff";
});
