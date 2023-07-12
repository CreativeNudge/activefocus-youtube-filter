// Initialize the extension's on/off state when the extension is loaded
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({isOn: true}, function() {
      console.log('The extension is on.');
    });
  });