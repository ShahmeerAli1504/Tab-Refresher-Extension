document.addEventListener('DOMContentLoaded', function() {
  const intervalInput = document.getElementById('interval');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const statusDiv = document.getElementById('status');

  // Load current state when popup opens
  loadCurrentState();

  // Event listeners
  startBtn.addEventListener('click', startAutoRefresh);
  stopBtn.addEventListener('click', stopAutoRefresh);
  intervalInput.addEventListener('input', validateInput);

  function loadCurrentState() {
    // Check if auto refresh is currently active
    chrome.runtime.sendMessage({action: 'getStatus'}, function(response) {
      if (response && response.isActive) {
        updateUI(true, response.interval);
        intervalInput.value = response.interval;
      } else {
        updateUI(false);
      }
    });
  }

  function startAutoRefresh() {
    const interval = parseInt(intervalInput.value);
    
    if (!validateInterval(interval)) {
      return;
    }

    // Get current active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        // Send message to background script to start auto refresh
        chrome.runtime.sendMessage({
          action: 'startRefresh',
          interval: interval,
          tabId: tabs[0].id
        }, function(response) {
          if (response && response.success) {
            updateUI(true, interval);
          } else {
            showError('Failed to start auto refresh');
          }
        });
      }
    });
  }

  function stopAutoRefresh() {
    chrome.runtime.sendMessage({action: 'stopRefresh'}, function(response) {
      if (response && response.success) {
        updateUI(false);
      } else {
        showError('Failed to stop auto refresh');
      }
    });
  }

  function validateInput() {
    const interval = parseInt(intervalInput.value);
    const isValid = validateInterval(interval);
    startBtn.disabled = !isValid || stopBtn.disabled === false;
  }

  function validateInterval(interval) {
    if (isNaN(interval) || interval < 1 || interval > 3600) {
      showError('Please enter a valid interval between 1 and 3600 seconds');
      return false;
    }
    return true;
  }

  function updateUI(isActive, interval = null) {
    if (isActive) {
      startBtn.disabled = true;
      stopBtn.disabled = false;
      intervalInput.disabled = true;
      statusDiv.textContent = `Auto refresh active (every ${interval} seconds)`;
      statusDiv.className = 'status active';
    } else {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      intervalInput.disabled = false;
      statusDiv.textContent = 'Auto refresh is stopped';
      statusDiv.className = 'status inactive';
    }
  }

  function showError(message) {
    statusDiv.textContent = message;
    statusDiv.className = 'status inactive';
    setTimeout(() => {
      loadCurrentState();
    }, 3000);
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'refreshStopped') {
      updateUI(false);
    }
  });
});