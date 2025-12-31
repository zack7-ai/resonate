// Content script for Resonate Hunter Extension

console.log('Resonate Hunter Extension: Content script loaded');

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillApplication') {
    console.log('Fill application requested');
    // TODO: Implement auto-fill logic
    sendResponse({ success: true, message: 'Fill application feature coming soon' });
  }

  if (request.action === 'scrapeData') {
    console.log('Scrape data requested');
    // TODO: Implement scraping logic
    sendResponse({ success: true, message: 'Scrape data feature coming soon' });
  }

  return true; // Keep message channel open for async response
});

// Log page URL and title when extension icon is clicked
// This is triggered by the popup opening, which queries the active tab
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', logPageInfo);
} else {
  logPageInfo();
}

function logPageInfo() {
  const pageInfo = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString()
  };

  console.log('Resonate Hunter - Page Info:', pageInfo);
  
  // Store in chrome.storage for later use
  chrome.storage.local.set({ 
    lastPageInfo: pageInfo 
  }, () => {
    console.log('Page info stored:', pageInfo);
  });
}

// Listen for when extension icon is clicked (via chrome.action.onClicked)
// Note: This only works if popup is not defined in manifest
// Since we have a popup, the popup.js handles the tab query instead


