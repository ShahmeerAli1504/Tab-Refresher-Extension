// Background script for Tab Auto Refresh Extension

let refreshState = {
  isActive: false,
  interval: 30,
  tabId: null,
  alarmName: 'tabAutoRefresh'
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'startRefresh':
      startAutoRefresh(request.interval, request.tabId)
        .then(() => sendResponse({success: true}))
        .catch(() => sendResponse({success: false}));
      return true; // Keep message channel open for async response
      
    case 'stopRefresh':
      stopAutoRefresh()
        .then(() => sendResponse({success: true}))
        .catch(() => sendResponse({success: false}));
      return true;
      
    case 'getStatus':
      sendResponse({
        isActive: refreshState.isActive,
        interval: refreshState.interval,
        tabId: refreshState.tabId
      });
      break;
  }
});

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === refreshState.alarmName && refreshState.isActive) {
    refreshTab();
  }
});

// Listen for tab updates/removal
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // If the tab being refreshed is updated, continue monitoring
  if (tabId === refreshState.tabId && refreshState.isActive) {
    // Tab is still active, continue refreshing
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // If the tab being refreshed is closed, stop auto refresh
  if (tabId === refreshState.tabId && refreshState.isActive) {
    stopAutoRefresh();
    // Notify popup if it's open
    chrome.runtime.sendMessage({action: 'refreshStopped'}).catch(() => {
      // Popup might not be open, ignore error
    });
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // All windows lost focus, but continue refreshing
    return;
  }
  
  // Check if the active tab changed
  if (refreshState.isActive) {
    chrome.tabs.query({active: true, windowId: windowId}, (tabs) => {
      if (tabs[0] && tabs[0].id !== refreshState.tabId) {
        // Active tab changed, but continue refreshing the original tab
      }
    });
  }
});

async function startAutoRefresh(interval, tabId) {
  try {
    // Clear any existing alarm
    await chrome.alarms.clear(refreshState.alarmName);
    
    // Validate tab exists
    const tab = await chrome.tabs.get(tabId);
    if (!tab) {
      throw new Error('Tab not found');
    }
    
    // Update state
    refreshState.isActive = true;
    refreshState.interval = interval;
    refreshState.tabId = tabId;
    
    // Create alarm for periodic refresh
    await chrome.alarms.create(refreshState.alarmName, {
      delayInMinutes: interval / 60,
      periodInMinutes: interval / 60
    });
    
    // Store state in chrome.storage for persistence
    await chrome.storage.local.set({
      refreshState: refreshState
    });
    
    console.log(`Auto refresh started for tab ${tabId} with interval ${interval} seconds`);
  } catch (error) {
    console.error('Failed to start auto refresh:', error);
    throw error;
  }
}

async function stopAutoRefresh() {
  try {
    // Clear alarm
    await chrome.alarms.clear(refreshState.alarmName);
    
    // Update state
    refreshState.isActive = false;
    refreshState.tabId = null;
    
    // Clear stored state
    await chrome.storage.local.remove('refreshState');
    
    console.log('Auto refresh stopped');
  } catch (error) {
    console.error('Failed to stop auto refresh:', error);
    throw error;
  }
}

async function refreshTab() {
  if (!refreshState.isActive || !refreshState.tabId) {
    return;
  }
  
  try {
    // Check if tab still exists
    const tab = await chrome.tabs.get(refreshState.tabId);
    if (!tab) {
      // Tab was closed, stop auto refresh
      await stopAutoRefresh();
      return;
    }
    
    // Refresh the tab
    await chrome.tabs.reload(refreshState.tabId);
    console.log(`Tab ${refreshState.tabId} refreshed`);
  } catch (error) {
    console.error('Failed to refresh tab:', error);
    // If tab doesn't exist or can't be refreshed, stop auto refresh
    await stopAutoRefresh();
  }
}

// Restore state on startup
chrome.runtime.onStartup.addListener(async () => {
  try {
    const result = await chrome.storage.local.get('refreshState');
    if (result.refreshState && result.refreshState.isActive) {
      // Restore previous state
      refreshState = result.refreshState;
      
      // Verify tab still exists
      try {
        await chrome.tabs.get(refreshState.tabId);
        // Tab exists, restart alarm
        await chrome.alarms.create(refreshState.alarmName, {
          delayInMinutes: refreshState.interval / 60,
          periodInMinutes: refreshState.interval / 60
        });
      } catch {
        // Tab doesn't exist, clear state
        await stopAutoRefresh();
      }
    }
  } catch (error) {
    console.error('Failed to restore state:', error);
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Auto Refresh extension installed');
});