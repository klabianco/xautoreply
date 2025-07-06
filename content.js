// X AutoReply - Content Script
// This script simulates keyboard shortcuts to automatically open reply windows

// Configuration
const config = {
  enabled: false,            // Extension starts disabled by default
  autoLoop: true,           // Whether to auto-loop after reply is complete
  delayBetweenActions: 800, // Milliseconds to wait between actions
  autoReplyAfter: 1       // Milliseconds to wait after 'j' before pressing 'r'
};

// Global status
let isRunning = false;

// Create status indicator
function createStatusIndicator() {
  const status = document.createElement('div');
  status.id = 'x-autoreply-status';
  status.style.position = 'fixed';
  status.style.top = '10px';
  status.style.right = '10px';
  status.style.backgroundColor = '#1DA1F2';
  status.style.color = 'white';
  status.style.padding = '5px 10px';
  status.style.borderRadius = '4px';
  status.style.zIndex = '10000';
  status.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  status.style.fontSize = '12px';
  status.style.fontWeight = 'bold';
  status.textContent = 'X AutoReply: OFF';
  document.body.appendChild(status);
  return status;
}

// Main functionality: Press j then r
function performJRSequence() {
  // First, simulate 'j' key
  console.log('X AutoReply: Pressing j');
  simulateKeyPress('j');
  
  // After delay, simulate 'r' key
  setTimeout(() => {
    console.log('X AutoReply: Pressing r');
    simulateKeyPress('r');
    // Auto-loop is always enabled, no need for continuation button
  }, config.autoReplyAfter);
}

// Main functionality is now handled by performJRSequence

// Add a visible continue button to manually trigger next sequence
// Continue button removed as auto-loop is always enabled

// Add a visible toggle button
function addToggleButton() {
  const btn = document.createElement('button');
  btn.id = 'x-autoreply-toggle';
  btn.textContent = 'Start JR Loop';
  btn.style.position = 'fixed';
  btn.style.bottom = '10px';
  btn.style.right = '10px';
  btn.style.backgroundColor = '#1DA1F2';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.padding = '10px 15px';
  btn.style.borderRadius = '4px';
  btn.style.zIndex = '10000';
  btn.style.cursor = 'pointer';
  btn.style.fontWeight = 'bold';
  
  btn.addEventListener('click', toggleExtension);
  document.body.appendChild(btn);
  return btn;
}

// Add auto-continue checkbox
// Auto-loop is always on by default

// Show notification message
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '70px';
  notification.style.right = '10px';
  notification.style.backgroundColor = '#1DA1F2';
  notification.style.color = 'white';
  notification.style.padding = '8px 12px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '10001';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  notification.style.transition = 'opacity 0.3s';
  
  document.body.appendChild(notification);
  
  // Fade out and remove after a delay
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Toggle extension on/off
function toggleExtension() {
  isRunning = !isRunning;
  
  // Update UI
  const status = document.getElementById('x-autoreply-status');
  if (status) {
    status.textContent = `X AutoReply: ${isRunning ? 'ON' : 'OFF'}`;
    status.style.backgroundColor = isRunning ? '#1DA1F2' : '#657786';
  }
  
  const toggleBtn = document.getElementById('x-autoreply-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = isRunning ? 'Stop JR Loop' : 'Start JR Loop';
  }
  
  // Show notification
  showNotification(`X AutoReply: ${isRunning ? 'Started' : 'Stopped'}`);
  
  // Start process if enabled
  if (isRunning) {
    console.log('X AutoReply: Triggering immediate J+R sequence');
    
    // Start the JR sequence with a minimal delay
    setTimeout(() => {
      performJRSequence();
    }, 50);
    
    // Set up keyboard listeners
    setupKeyListeners();
  }
}

// Set up keyboard listeners to detect reply sent
function setupKeyListeners() {
  // Add event listener for Enter key to detect when a reply is sent
  document.addEventListener('keydown', handleKeyDown);
  
  // Also listen for clicks on the reply button
  document.addEventListener('click', handleClick);
}

// Handle keydown events
function handleKeyDown(e) {
  if (!isRunning) return;
  
  // Check for Enter key which might indicate reply sent
  if (e.key === 'Enter') {
    console.log('X AutoReply: Enter key detected');
    
    // Only respond to Enter if we're likely in a reply box (focused on textarea or similar)
    const activeElement = document.activeElement;
    const isInInput = activeElement && (
      activeElement.tagName === 'TEXTAREA' || 
      activeElement.tagName === 'INPUT' ||
      activeElement.getAttribute('contenteditable') === 'true' ||
      activeElement.getAttribute('role') === 'textbox'
    );
    
    if (isInInput) {
      console.log('X AutoReply: Enter key in text input - likely sending reply');
      
      // Setup modal detection to trigger next cycle when dialog disappears
      setTimeout(() => {
        if (!setupModalObserver()) {
          // Fallback to timer if modal detection fails
          console.log('X AutoReply: Using fallback timer method for Enter key');
          setTimeout(() => {
            console.log('X AutoReply: Auto-continuing after Enter key (fallback)');
            performJRSequence();
          }, config.delayBetweenActions);
        }
      }, 200); // Short delay to ensure dialog is visible
    }
  }
}

// Setup modal disappearance detection
function setupModalObserver() {
  console.log('X AutoReply: Setting up modal observer');
  
  // Find all dialog elements that might be reply modals
  const dialogs = document.querySelectorAll('[role="dialog"]');
  if (dialogs.length === 0) {
    console.log('X AutoReply: No modal dialogs found');
    return false;
  }
  
  // Find the most likely reply dialog (usually the last one)
  const replyDialog = dialogs[dialogs.length - 1];
  console.log('X AutoReply: Found modal dialog:', replyDialog);
  
  // Create a mutation observer to watch for dialog removal
  const observer = new MutationObserver((mutations, obs) => {
    // Check if dialog has been removed or hidden
    if (!document.body.contains(replyDialog) || 
        replyDialog.style.display === 'none' || 
        replyDialog.getAttribute('aria-hidden') === 'true') {
      
      console.log('X AutoReply: Dialog disappeared, triggering next cycle');
      obs.disconnect(); // Stop observing since dialog is gone
      
      // Trigger next J+R sequence (auto-loop is always enabled)
      if (isRunning) {
        setTimeout(performJRSequence, 100); // Small delay for UI to update
      }
    }
  });
  
  // Watch for changes to dialog and its parent
  observer.observe(replyDialog, { attributes: true });
  if (replyDialog.parentElement) {
    observer.observe(replyDialog.parentElement, { childList: true });
  }
  observer.observe(document.body, { childList: true, subtree: false });
  
  console.log('X AutoReply: Modal observer setup complete');
  return true;
}

// Handle click events
function handleClick(e) {
  if (!isRunning) return;
  
  // Create a function to check if an element is a reply/tweet button
  function isReplyOrTweetButton(element) {
    if (!element) return false;
    
    // Check for common button attributes
    if (element.getAttribute('data-testid') === 'tweetButton') return true;
    if (element.getAttribute('aria-label') === 'Reply') return true;
    
    // Check text content
    const text = element.textContent && element.textContent.toLowerCase();
    if (text && (text === 'reply' || text === 'post' || text === 'tweet' || text.includes('reply'))) {
      return true;
    }
    
    // Check parent elements up to 3 levels
    if (element.parentElement) {
      return isReplyOrTweetButton(element.parentElement);
    }
    
    return false;
  }
  
  // Check if the clicked element is a reply button
  if (isReplyOrTweetButton(e.target)) {
    console.log('X AutoReply: Reply/Tweet button detected');
    
    // Setup modal detection to trigger next cycle when dialog disappears
    setTimeout(() => {
      if (!setupModalObserver()) {
        // Fallback to timer if modal detection fails
        console.log('X AutoReply: Using fallback timer method');
        setTimeout(() => {
          console.log('X AutoReply: Auto-continuing (fallback)');
          performJRSequence();
        }, config.delayBetweenActions);
      }
    }, 200); // Short delay to ensure dialog is visible
  }
}

// Simulate a keyboard key press (more reliable version)
function simulateKeyPress(key) {
  console.log(`X AutoReply: Simulating "${key}" key press`);
  
  // Get the keyCode for the key
  const keyCode = key.charCodeAt(0);
  
  // Create all necessary keyboard events with complete properties
  const keyDownEvent = new KeyboardEvent('keydown', {
    key: key,
    code: `Key${key.toUpperCase()}`,
    keyCode: keyCode,
    which: keyCode,
    charCode: 0,
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window
  });
  
  const keyPressEvent = new KeyboardEvent('keypress', {
    key: key,
    code: `Key${key.toUpperCase()}`,
    keyCode: keyCode,
    which: keyCode,
    charCode: keyCode,
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window
  });
  
  const keyUpEvent = new KeyboardEvent('keyup', {
    key: key,
    code: `Key${key.toUpperCase()}`,
    keyCode: keyCode,
    which: keyCode,
    charCode: 0,
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window
  });
  
  // Define all possible targets to dispatch the events
  const targets = [
    document,                      // Document level
    document.body,                 // Body level
    document.documentElement,      // HTML level
    document.activeElement,        // Currently focused element
    document.querySelector('main'), // Main content area
    document.querySelector('[role="main"]'),
    document.querySelector('[data-testid="primaryColumn"]')
  ];
  
  // Dispatch events to all valid targets
  targets.forEach(target => {
    if (target) {
      try {
        // Fire the complete keyboard event sequence
        target.dispatchEvent(keyDownEvent);
        target.dispatchEvent(keyPressEvent);
        target.dispatchEvent(keyUpEvent);
      } catch(e) {
        console.error('Error dispatching event:', e);
      }
    }
  });
}

// Initialize the extension
function initialize() {
  console.log('X AutoReply: Initializing');
  const status = createStatusIndicator();
  const toggleBtn = addToggleButton();
  
  // Add keyboard shortcut (Ctrl+Shift+A) to toggle
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      toggleExtension();
    }
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
