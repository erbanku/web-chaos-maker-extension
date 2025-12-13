// Active animation intervals
let activeIntervals = [];
let activeAnimations = [];

// Current saved state for this page
let savedState = {
    backgroundColor: "",
    rotation: 0,
    transform: "",
    flipX: 1,
    flipY: 1,
    scale: 1,
};

// Apply saved state to the page
function applySavedState() {
    const body = document.body;

    if (savedState.backgroundColor) {
        body.style.backgroundColor = savedState.backgroundColor;
    }

    if (savedState.rotation !== 0) {
        body.style.transformOrigin = "center center";
        body.style.transform = `rotate(${savedState.rotation}deg)`;
    }
}

// Load settings from storage and apply them
async function loadAndApplySettings() {
    const domain = window.location.hostname;
    const storageKey = `site_${domain}`;

    chrome.storage.local.get(storageKey, (result) => {
        if (result[storageKey]) {
            const settings = result[storageKey];

            if (settings.action === "changeBackground" && settings.data.color) {
                savedState.backgroundColor = settings.data.color;
                document.body.style.backgroundColor = settings.data.color;
            } else if (
                settings.action === "rotate2d" &&
                settings.data.angle !== undefined
            ) {
                savedState.rotation = settings.data.angle;
                document.body.style.transformOrigin = "center center";
                document.body.style.transform = `rotate(${settings.data.angle}deg)`;
            } else if (
                settings.action === "resetAll" ||
                settings.action === "resetBackground"
            ) {
                savedState = {
                    backgroundColor: "",
                    rotation: 0,
                    transform: "",
                    flipX: 1,
                    flipY: 1,
                    scale: 1,
                };
            }
        }
    });
}

// Load settings when page loads
loadAndApplySettings();

// Re-apply settings when navigating within the same site (SPA)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        // Re-apply saved state on navigation
        setTimeout(applySavedState, 100);
    }
}).observe(document, { subtree: true, childList: true });

// Cleanup function
function stopAllAnimations() {
    activeIntervals.forEach((interval) => clearInterval(interval));
    activeIntervals = [];
    activeAnimations.forEach((anim) => anim.remove());
    activeAnimations = [];

    const body = document.body;
    body.style.animation = "";
    // Don't reset backgroundColor and transform here - they're persistent
    body.style.perspective = "";
    // body.style.filter = "";  // Keep user filters

    // Remove any injected elements
    document.querySelectorAll(".chaos-overlay").forEach((el) => el.remove());
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const body = document.body;

    switch (request.action) {
        case "changeBackground":
            body.style.backgroundColor = request.color;
            savedState.backgroundColor = request.color;
            break;

        case "resetBackground":
            body.style.backgroundColor = "";
            savedState.backgroundColor = "";
            break;

        case "rotate2d":
            body.style.transformOrigin = "center center";
            body.style.transform = `rotate(${request.angle}deg) scale(${
                savedState.scale || 1
            }) scaleX(${savedState.flipX || 1}) scaleY(${
                savedState.flipY || 1
            })`;
            savedState.rotation = request.angle;
            break;

        case "applyFilters":
            const filterParts = [];
            if (request.brightness !== 100)
                filterParts.push(`brightness(${request.brightness}%)`);
            if (request.contrast !== 100)
                filterParts.push(`contrast(${request.contrast}%)`);
            if (request.sepia > 0) filterParts.push(`sepia(${request.sepia}%)`);
            if (request.blur > 0) filterParts.push(`blur(${request.blur}px)`);
            if (request.grayscale > 0)
                filterParts.push(`grayscale(${request.grayscale}%)`);
            if (request.invert > 0)
                filterParts.push(`invert(${request.invert}%)`);
            body.style.filter = filterParts.join(" ");
            break;

        case "zoom":
            body.style.transformOrigin = "center center";
            const currentRotation = savedState.rotation || 0;
            const flipX = savedState.flipX || 1;
            const flipY = savedState.flipY || 1;
            body.style.transform = `rotate(${currentRotation}deg) scale(${
                request.scale * flipX
            }, ${request.scale * flipY})`;
            savedState.scale = request.scale;
            break;

        case "rotate3d":
            // Keep for backward compatibility but not saved
            body.style.transformOrigin = "center center";
            body.style.perspective = "1000px";
            body.style.transform = `rotateX(${request.x}deg) rotateY(${request.y}deg) rotateZ(${request.z}deg)`;
            break;

        case "rainbowMode":
            stopAllAnimations();
            let hue = 0;
            const rainbowInterval = setInterval(() => {
                body.style.backgroundColor = `hsl(${hue}, 100%, 80%)`;
                hue = (hue + 2) % 360;
            }, 50);
            activeIntervals.push(rainbowInterval);
            break;

        case "discoMode":
            stopAllAnimations();
            const discoInterval = setInterval(() => {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            }, 200);
            activeIntervals.push(discoInterval);
            break;

        case "spinMode":
            stopAllAnimations();
            body.style.transformOrigin = "center center";
            body.style.animation = "spin 2s linear infinite";
            if (!document.querySelector("#spin-keyframes")) {
                const style = document.createElement("style");
                style.id = "spin-keyframes";
                style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }
            break;

        case "bounceMode":
            stopAllAnimations();
            body.style.animation = "bounce 0.5s ease-in-out infinite";
            if (!document.querySelector("#bounce-keyframes")) {
                const style = document.createElement("style");
                style.id = "bounce-keyframes";
                style.textContent = `@keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }`;
                document.head.appendChild(style);
            }
            break;

        case "shakeMode":
            stopAllAnimations();
            body.style.animation = "shake 0.3s ease-in-out infinite";
            if (!document.querySelector("#shake-keyframes")) {
                const style = document.createElement("style");
                style.id = "shake-keyframes";
                style.textContent = `@keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }`;
                document.head.appendChild(style);
            }
            break;

        case "flipMode":
            stopAllAnimations();
            body.style.animation = "flip 2s ease-in-out infinite";
            if (!document.querySelector("#flip-keyframes")) {
                const style = document.createElement("style");
                style.id = "flip-keyframes";
                style.textContent = `@keyframes flip {
                    0% { transform: rotateY(0deg); }
                    50% { transform: rotateY(180deg); }
                    100% { transform: rotateY(360deg); }
                }`;
                document.head.appendChild(style);
            }
            break;

        case "glitchMode":
            stopAllAnimations();
            const glitchInterval = setInterval(() => {
                body.style.transform = `translate(${
                    Math.random() * 10 - 5
                }px, ${Math.random() * 10 - 5}px)`;
                body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            }, 100);
            activeIntervals.push(glitchInterval);
            break;

        case "matrixMode":
            stopAllAnimations();
            createMatrixRain();
            break;

        case "confettiMode":
            stopAllAnimations();
            createConfetti();
            break;

        case "upsideDown":
            stopAllAnimations();
            savedState.flipY *= -1;
            applyTransform();
            break;

        case "mirrorMode":
            stopAllAnimations();
            savedState.flipX *= -1;
            applyTransform();
            break;

        case "wobbleMode":
            stopAllAnimations();
            body.style.animation = "wobble 1s ease-in-out infinite";
            if (!document.querySelector("#wobble-keyframes")) {
                const style = document.createElement("style");
                style.id = "wobble-keyframes";
                style.textContent = `@keyframes wobble {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-5deg); }
                    75% { transform: rotate(5deg); }
                }`;
                document.head.appendChild(style);
            }
            break;

        case "crazyZoom":
            stopAllAnimations();
            body.style.animation = "crazyZoom 1s ease-in-out infinite";
            if (!document.querySelector("#crazyZoom-keyframes")) {
                const style = document.createElement("style");
                style.id = "crazyZoom-keyframes";
                style.textContent = `@keyframes crazyZoom {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }`;
                document.head.appendChild(style);
            }
            break;

        case "comboMode":
            stopAllAnimations();
            // ULTIMATE CHAOS!!!
            body.style.animation = "combo 1s ease-in-out infinite";
            if (!document.querySelector("#combo-keyframes")) {
                const style = document.createElement("style");
                style.id = "combo-keyframes";
                style.textContent = `@keyframes combo {
                    0% { transform: rotate(0deg) scale(1) translateX(0); filter: hue-rotate(0deg); }
                    25% { transform: rotate(90deg) scale(1.1) translateX(-20px); filter: hue-rotate(90deg); }
                    50% { transform: rotate(180deg) scale(0.9) translateX(20px); filter: hue-rotate(180deg); }
                    75% { transform: rotate(270deg) scale(1.1) translateX(-20px); filter: hue-rotate(270deg); }
                    100% { transform: rotate(360deg) scale(1) translateX(0); filter: hue-rotate(360deg); }
                }`;
                document.head.appendChild(style);
            }

            const comboInterval = setInterval(() => {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            }, 300);
            activeIntervals.push(comboInterval);
            createConfetti();
            break;

        case "resetAll":
            stopAllAnimations();
            body.style.backgroundColor = "";
            body.style.transform = "";
            body.style.transformOrigin = "";
            savedState = {
                backgroundColor: "",
                rotation: 0,
                scale: 1,
                flipX: 1,
                flipY: 1,
                transform: "",
            };
            applyTransform();
            body.style.filter = "";
            break;

        default:
            console.log("Unknown action:", request.action);
    }

    sendResponse({ status: "success" });
    return true;
});

// Matrix Rain Effect
function createMatrixRain() {
    const overlay = document.createElement("div");
    overlay.className = "chaos-overlay matrix-rain";
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.8);
    `;
    document.body.appendChild(overlay);

    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    overlay.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const chars = "01アイウエオカキクケコサシスセソタチツテト".split("");
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const matrixInterval = setInterval(() => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 50);
    activeIntervals.push(matrixInterval);
}

// Confetti Effect
function createConfetti() {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement("div");
            confetti.className = "chaos-overlay confetti";
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: hsl(${Math.random() * 360}, 100%, 50%);
                top: -10px;
                left: ${Math.random() * 100}%;
                pointer-events: none;
                z-index: 999999;
                animation: confettiFall ${
                    2 + Math.random() * 3
                }s linear forwards;
            `;
            document.body.appendChild(confetti);

            if (!document.querySelector("#confetti-keyframes")) {
                const style = document.createElement("style");
                style.id = "confetti-keyframes";
                style.textContent = `@keyframes confettiFall {
                    to {
                        transform: translateY(${
                            window.innerHeight + 20
                        }px) rotate(${Math.random() * 720}deg);
                        opacity: 0;
                    }
                }`;
                document.head.appendChild(style);
            }

            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

// Add this function before the message listener
function applyTransform() {
    const body = document.body;
    const rotation = savedState.rotation || 0;
    const scale = savedState.scale || 1;
    const flipX = savedState.flipX || 1;
    const flipY = savedState.flipY || 1;
    body.style.transformOrigin = "center center";
    body.style.transform = `rotate(${rotation}deg) scale(${scale}, ${
        flipY * scale
    }) scaleX(${flipX})`;
}
