# Web Chaos Maker

A fun Chrome extension that transforms any webpage with dynamic visual effects. Change backgrounds, rotate content, and apply entertaining animations.

**Note:** This extension is designed for entertainment purposes.

[Chrome Web Store](https://chromewebstore.google.com/detail/web-chaos-maker-%F0%9F%8E%A8/igidggepifmnnhlimhglmemllodhmdep)

## Features

### Background Controls

- **Color Picker** - Choose any color for the background (saved per site)
- **Rainbow Mode** - Continuous rainbow color cycling
- **Disco Mode** - Random flashing colors

### Rotation & Transforms

- **Custom Rotation** - Spin the page 0-360 degrees with precision
- **Rotation Presets** - Quick buttons: 90°, 180°, 270°, 0° (reset)
- **Spin Animation** - Continuous infinite spinning
- **Auto-Save** - Rotation and color settings persist per site across page reloads

### Visual Effects

- **Bounce** - Vertical bouncing animation
- **Shake** - Vibration effect
- **Flip** - Horizontal page flip
- **Glitch** - Random distortion effects
- **Matrix Rain** - Cascading green characters overlay
- **Confetti** - Falling confetti animation
- **Upside Down** - Vertical flip
- **Mirror** - Horizontal flip
- **Wobble** - Gentle wave motion
- **Zoom** - Pulsating zoom in/out

### Ultimate Chaos

Combo button that applies multiple effects simultaneously for maximum visual impact.

### Persistent Settings

Settings are automatically saved per website domain and persist across:

- Page refreshes
- Navigation to different pages on the same site
- Browser restarts

Each domain maintains independent settings.

## Installation

### Development Setup

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select the `src` folder
6. The extension icon appears in your Chrome toolbar

### Production

This extension is available on the [Chrome Web Store](https://chromewebstore.google.com/detail/web-chaos-maker-%F0%9F%8E%A8/igidggepifmnnhlimhglmemllodhmdep).

## Usage

### Getting Started

1. Navigate to any webpage
2. Click the Web Chaos Maker extension icon
3. Select effects from the popup interface

### Background & Rotation

- **Color Picker** - Select a color; changes apply automatically
- **Rotation Presets** - Instant buttons: 90°, 180°, 270°, 0° (reset)
- **Custom Rotation** - Fine-tune rotation using the slider
- **Settings Auto-Save** - All color and rotation changes persist per domain

### Effects

- **Rainbow Mode** - Cycling color animation
- **Disco Mode** - Random color flashing
- **Spin Animation** - Continuous rotation
- **Temporary Effects** - All visual effects (bounce, shake, flip, etc.) reset on page refresh
- **Ultimate Chaos** - Applies multiple effects simultaneously

### Reset

Click "Stop the Madness" button to clear all effects and reset saved settings.

## Project Structure

```txt
src/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup logic and controls
├── content.js            # Content script for webpage manipulation
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## Technical Notes

- Visual effects are temporary and reset on page refresh
- Matrix Rain and Confetti create visual overlays above page content
- Color and rotation settings persist using Chrome's storage API
- Each domain maintains isolated settings
- Effects are applied via CSS transforms and animations

## License

MIT License - This project is open source and available for use.
