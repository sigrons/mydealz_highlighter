// background.js

// This is a placeholder background script.
// You can add any background tasks here if needed.

console.log("Background script is running.");

// Example: Listening for a tab being updated (e.g., a new page load)
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Ensure that tab.url is defined before proceeding
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("mydealz.de")) {
        // Do something here when a tab finishes loading a page from mydealz.de
        console.log("A tab finished loading mydealz.de:", tab.url);
    }
});
