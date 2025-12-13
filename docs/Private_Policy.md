# Privacy Policy

**Effective Date:** December 13, 2025
**Last Updated:** December 13, 2025

## 1. Introduction

Web Chaos Maker is a fun, open-source Chrome browser extension that adds visual effects like colors, rotations, confetti, Matrix rain, and other chaotic animations to any webpage.

**I do not collect, store, or transmit any personal information.** Your privacy is important to me, and this extension operates entirely on your local device.

## 2. Local Storage Usage

The extension uses Chrome's built-in `chrome.storage` API to save your **personalized settings per website domain** (e.g., background color, rotation angle).

**Key points:**
- Data is stored **locally in your browser only**.
- Settings are **domain-specific** (e.g., settings for google.com don't affect youtube.com).
- Data persists across browser sessions but can be cleared anytime:
  - Use the "Reset" button in the extension popup.
  - Clear browser storage via Chrome settings.
  - Uninstall the extension.
- Example stored data: `{ "https://example.com": { "bgColor": "#ff0000", "rotation": 90 } }`

No sensitive information is stored.

## 3. Permissions Explained

The extension requests minimal permissions:

| Permission | Purpose | Scope |
|------------|---------|-------|
| `activeTab` | Inject visual effects (CSS/JS) into the **current tab only** when you activate the extension. | User-initiated, single tab. |
| `storage` | Save/load your color and rotation preferences locally. | Local browser storage only. |

No other permissions are required. Content scripts run on `<all_urls>` but only modify visual styles (no data access).

## 4. Third-Party Services & Sharing

- **No third-party analytics** (e.g., no Google Analytics).
- **No advertising trackers**.
- **No data sharing** with any services.
- Fully client-side; no network requests.

## 5. Contact Me

For questions or concerns:
- [GitHub Repository](https://github.com/erbanku/web-chaos-maker-extension)
- Open an issue or contact me via GitHub.

---

*This extension is open-source. Review the code in `src/` for full transparency.*
