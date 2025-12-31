// Resonate Hunter - Background Service Worker

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Resonate Hunter installed');
    // Open welcome page or dashboard
    chrome.tabs.create({
      url: 'http://localhost:3000/dashboard'
    });
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureJob') {
    // Handle job capture
    console.log('Job capture requested:', request.data);
    sendResponse({ success: true });
  }
  return true; // Keep message channel open for async response
});
