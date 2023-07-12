// Function to get the API key
function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('apiKey', function(data) {
      resolve(data.apiKey);
      console.log('Retrieved API key:', data.apiKey);
    });
  });
}

// Function to handle turning on the application
async function turnOn() {
  var apiKey = await getApiKey();
  console.log('API key in turnOn:', apiKey);

  if (!apiKey || apiKey.trim() === '') {
    chrome.storage.sync.set({ isOn: false }, function() {
      updateToggleButton(false);
      alert('Please enter your YouTube API key in the settings before turning on the application.');
    });
    return;
  }

  chrome.storage.sync.set({ isOn: true }, function() {
    updateToggleButton(true);
  });
}

// Function to handle turning off the application
function turnOff() {
  chrome.storage.sync.set({ isOn: false }, function() {
    updateToggleButton(false);
  });
}

// Function to update the toggle button state
function updateToggleButton(isOn) {
  var toggleButton = document.getElementById('toggle-button');
  toggleButton.textContent = isOn ? 'Turn Off' : 'Turn On';
  toggleButton.classList.toggle('isOn', isOn);
}

// Toggle button event listener
document.getElementById('toggle-button').addEventListener('click', function() {
  chrome.storage.sync.get('isOn', function(data) {
    var isOn = data.isOn;

    if (isOn) {
      turnOff();
    } else {
      turnOn();
    }
  });
});

// Open settings.html when the "Settings" button is clicked
document.getElementById('settings-button').addEventListener('click', function () {
  chrome.runtime.openOptionsPage();
});

// "Support" button event listener
document.getElementById('support-button').addEventListener('click', function () {
  chrome.tabs.create({ url: 'https://bmc.link/youtubeblocker' });
});

// Open help.html when the "Help" button is clicked
document.getElementById('help-button').addEventListener('click', function() {
  window.open('../html/help.html', '_blank');
});

// Set the button text and class when the popup loads
chrome.storage.sync.get(['isOn', 'apiKey'], function(data) {
  var isOn = data.isOn;
  var apiKey = data.apiKey;
  updateToggleButton(isOn && apiKey && apiKey.trim() !== '');
});

// Check if the API key is set on popup load
chrome.storage.sync.get('apiKey', function(data) {
  var apiKey = data.apiKey;
});