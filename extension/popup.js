// Resonate Hunter - Popup Logic

const API_BASE_URL = 'http://localhost:3000';
const JOBS_API_URL = `${API_BASE_URL}/api/jobs`;

// DOM Elements
const captureBtn = document.getElementById('captureBtn');
const statusMessage = document.getElementById('statusMessage');
const dashboardBtn = document.getElementById('dashboardBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  captureBtn.addEventListener('click', handleCaptureTarget);
  dashboardBtn.addEventListener('click', handleOpenDashboard);
  checkConnection();
});

// Check connection to Command Center
async function checkConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      updateStatus('Connected to Command Center', 'success');
    } else {
      updateStatus('Command Center unreachable', 'error');
    }
  } catch (error) {
    console.error('Connection check failed:', error);
    // Don't show error on initial load, just log it
  }
}

// Handle Capture Target button click
async function handleCaptureTarget() {
  // Disable button during capture
  captureBtn.disabled = true;
  captureBtn.textContent = 'Capturing...';
  clearStatus();

  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('No active tab found');
    }

    // Extract page data
    const pageData = {
      title: tab.title || 'Untitled',
      url: tab.url || '',
      timestamp: new Date().toISOString(),
    };

    // Get page content (job description)
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractJobDescription,
    });

    if (result && result.result) {
      pageData.jobDescription = result.result;
    }

    // Send to Command Center
    let response;
    try {
      response = await fetch(JOBS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });
    } catch (fetchError) {
      // Network error - server is down
      throw new Error('Connection Error: Command Center is unreachable. Make sure the server is running.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to capture target' }));
      throw new Error(errorData.message || 'Failed to capture target');
    }

    const data = await response.json();
    
    // Success!
    updateStatus('✅ Target Acquired', 'success');
    captureBtn.textContent = 'Target Captured!';
    
    // Reset button after 2 seconds
    setTimeout(() => {
      captureBtn.disabled = false;
      captureBtn.innerHTML = '<span class="button-icon">🎯</span><span class="button-text">Capture Target</span>';
      clearStatus();
    }, 2000);

  } catch (error) {
    console.error('Capture failed:', error);
    
    // Handle connection errors specifically
    let errorMessage = error.message;
    if (error.message.includes('Connection Error') || error.message.includes('Failed to fetch')) {
      errorMessage = 'Connection Error: Command Center is unreachable. Make sure the server is running at http://localhost:3000';
    }
    
    updateStatus(`❌ ${errorMessage}`, 'error');
    captureBtn.disabled = false;
    captureBtn.innerHTML = '<span class="button-icon">🎯</span><span class="button-text">Capture Target</span>';
    
    // Clear error after 5 seconds for connection errors
    setTimeout(() => {
      clearStatus();
    }, 5000);
  }
}

// Extract job description from page
function extractJobDescription() {
  // Try to find common job description selectors
  const selectors = [
    '[data-testid="job-description"]',
    '.job-description',
    '.jobDescription',
    '#job-description',
    '[class*="description"]',
    '[id*="description"]',
    'article',
    'main',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.innerText || element.textContent || '';
      if (text.length > 100) {
        return text.trim();
      }
    }
  }

  // Fallback: get body text
  const body = document.body;
  if (body) {
    return body.innerText || body.textContent || '';
  }

  return '';
}

// Update status message
function updateStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

// Clear status message
function clearStatus() {
  statusMessage.textContent = '';
  statusMessage.className = 'status-message';
}

// Handle Open Dashboard button click
function handleOpenDashboard() {
  chrome.tabs.create({
    url: 'http://localhost:3000/dashboard'
  });
}
