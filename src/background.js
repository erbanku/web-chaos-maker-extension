// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    let action, data;
    const domain = new URL(tab.url).hostname;
    const storageKey = `site_${domain}`;

    switch (command) {
        case "rotate-90":
            action = "rotate2d";
            data = { angle: 90 };
            break;
        case "rotate-180":
            action = "rotate2d";
            data = { angle: 180 };
            break;
        case "rotate-270":
            action = "rotate2d";
            data = { angle: 270 };
            break;
        case "reset-all":
            action = "resetAll";
            data = {};
            break;
    }

    if (action) {
        // Send message to content script with error handling
        try {
            await chrome.tabs.sendMessage(tab.id, { action, ...data });
        } catch (error) {
            // Silently handle errors for special pages where content scripts can't run
            console.log('Content script not available on this page:', error.message);
            return;
        }

        // Save the setting
        const settings = {
            action,
            data,
            timestamp: Date.now(),
        };
        await chrome.storage.local.set({ [storageKey]: settings });
    }
});
