// Function to get the API key
function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('apiKey', function(data) {
      resolve(data.apiKey);
    });
  });
}

// Check if a video title or category is unproductive
function isUnproductive(title, categoryId, tags) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['allowedCategories', 'allowTags', 'denyTags', 'isOn'], function(data) {
      var allowedCategories = data.allowedCategories;
      var allowTags = data.allowTags;
      var denyTags = data.denyTags;
      var isOn = data.isOn;

      if (!isOn || !allowedCategories || !Array.isArray(allowedCategories)) {
        resolve(true);
        return;
      }

      if (!Array.isArray(denyTags) || !Array.isArray(allowTags)) {
        resolve(false);
        return;
      }

      for (var i = 0; i < denyTags.length; i++) {
        if (title.includes(denyTags[i])) {
          resolve(true);
          return;
        }
      }

      for (var j = 0; j < denyTags.length; j++) {
        if (tags.includes(denyTags[j])) {
          resolve(true);
          return;
        }
      }

      var titleHasAllowTag = allowTags.some(tag => {
        var regex = new RegExp('\\b' + tag + '\\b', 'gi');
        return regex.test(title);
      });
      var tagsHaveAllowTag = tags.some(tag => allowTags.includes(tag.toLowerCase()));
      var categoryIsAllowed = allowedCategories.includes(Number(categoryId));
      
      if (titleHasAllowTag || tagsHaveAllowTag || categoryIsAllowed) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Block or allow a video based on its title, category, and tags
async function checkVideo() {
  chrome.storage.sync.get('isOn', function(data) {
    var isOn = data.isOn;
    if (!isOn) return; // If the extension is off, exit the function

    // Get the video ID from the URL
    var videoId = new URLSearchParams(window.location.search).get('v');
    if (!videoId) return; // If there's no video ID in the URL, exit the function

    // Get the API key from storage
    getApiKey().then(apiKey => {
      // Request video details from the YouTube Data API
      fetch('https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=' + apiKey + '&part=snippet')
        .then(response => {
          if (!response.ok) {
            throw new Error('API request failed');
          }
          return response.json();
        })
        .then(data => {
          var title = data.items[0].snippet.title.toLowerCase();
          var categoryId = data.items[0].snippet.categoryId;
          var tags = data.items[0].snippet.tags || [];

          isUnproductive(title, categoryId, tags).then(isUnproductive => {
            if (isUnproductive) {
              // Show a pop-up message
              alert('Sorry, this video is not productive!');
              // Block the video by redirecting to the YouTube homepage
              window.location.href = 'https://www.youtube.com';
            }
          });
        });
    });
  });
}

// Run the video blocking code when the page loads
checkVideo();

// Run the video blocking code whenever the URL changes
new MutationObserver(checkVideo).observe(document.querySelector('title'), {childList: true});
