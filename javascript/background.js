// Initialize the extension's on/off state when the extension is loaded
chrome.runtime.onInstalled.addListener(function() {
  chrome.action.setIcon({ path: "active_icon.png" }); // Set the active icon
  chrome.storage.sync.set({ isOn: true }, function() {
    console.log('The extension is on.');
  });
});

// Toggle the extension on/off state
chrome.action.onClicked.addListener(function() {
  chrome.storage.sync.get('isOn', function(data) {
    var isOn = data.isOn;
    isOn = !isOn;
    chrome.storage.sync.set({ isOn: isOn }, function() {
      console.log('The extension is ' + (isOn ? 'on' : 'off') + '.');
      if (isOn) {
        chrome.action.setIcon({ path: "active_icon.png" }); // Set the active icon
      } else {
        chrome.action.setIcon({ path: "inactive_icon.png" }); // Set the inactive icon
      }
    });
  });
});
