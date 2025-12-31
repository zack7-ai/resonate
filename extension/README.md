# Resonate Hunter Extension

Chrome extension for auto-filling job applications and tracking career search activity.

## Setup Instructions

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The extension icon should appear in your Chrome toolbar

## Features

- **Popup HUD**: Dark-mode sidebar interface matching Resonate's "Stealth Command" theme
- **Page Tracking**: Logs current page URL and title when extension icon is clicked
- **Auto-Fill**: (Coming soon) Auto-fill job applications
- **Data Scraping**: (Coming soon) Scrape job posting data
- **Job Tracking**: Track jobs for later reference

## File Structure

- `manifest.json`: Extension configuration (Manifest V3)
- `popup.html`: Popup interface HTML
- `popup.css`: Styling for popup (dark theme with RezPulse animation)
- `popup.js`: Popup logic and event handlers
- `content.js`: Content script that runs on web pages
- `background.js`: Background service worker for extension logic

## Permissions

- `storage`: Store tracked jobs and settings
- `scripting`: Inject scripts into web pages
- `activeTab`: Access current tab information
- `tabs`: Query tab information

## Notes

- Icon files (icon16.png, icon48.png, icon128.png) need to be added
- The extension uses Chrome's Manifest V3 format
- All styling matches Resonate's brand colors (Midnight Slate, Governance Blue, Pulse Green)


