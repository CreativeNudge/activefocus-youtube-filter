window.onload = function() {
  // Get the API key input field
  var apiKeyInput = document.getElementById('api-key');

  // Listen for changes in the API key input field
  apiKeyInput.addEventListener('input', function(event) {
    // Get the entered API key value
    var apiKey = event.target.value;

    // Save the API key
    chrome.storage.sync.set({ apiKey: apiKey }, function() {
      console.log('API key saved:', apiKey);
    });
  });

  // Function to adjust the height of the textarea based on content
  function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto'; // Reset the height to auto
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height based on content
  }

  // Add event listeners to the allow-tags and deny-tags inputs
  var allowTagsInput = document.getElementById('allow-tags');
  var denyTagsInput = document.getElementById('deny-tags');

  allowTagsInput.addEventListener('input', function() {
    adjustTextareaHeight(allowTagsInput);
  });

  denyTagsInput.addEventListener('input', function() {
    adjustTextareaHeight(denyTagsInput);
  });

  // Call the adjustTextareaHeight function initially to set the correct height
  adjustTextareaHeight(allowTagsInput);
  adjustTextareaHeight(denyTagsInput);

  // When the save button is clicked, save the settings
  document.getElementById('saveButton').addEventListener('click', function() {
    var categories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(function(checkbox) {
      return checkbox.value;
    });

    var allowTags = document.getElementById('allow-tags').value.toLowerCase().split(/[\s,]+/).filter(Boolean);

    var denyTags = document.getElementById('deny-tags').value.toLowerCase().split(/[\s,]+/).filter(Boolean);

    chrome.storage.sync.set({
      allowedCategories: categories,
      allowTags: allowTags,
      denyTags: denyTags
    }, function() {
      alert('Settings saved!');
    });
  });

  // When the update button is clicked, display an alert
  document.getElementById('updateButton').addEventListener('click', function() {
    alert('API Key saved!');
  });

  // Load the saved settings when the page loads
  chrome.storage.sync.get(['allowedCategories', 'allowTags', 'denyTags'], function(data) {
    var categories = data.allowedCategories || [];
    var allowTags = data.allowTags || [];
    var denyTags = data.denyTags || [];

    // Update category checkboxes based on saved categories
    categories.forEach(function(category) {
      document.querySelector('input[name="categories"][value="' + category + '"]').checked = true;
    });

    // Update allowTags and denyTags text boxes with saved values
    document.getElementById('allow-tags').value = allowTags.join(', ');
    document.getElementById('deny-tags').value = denyTags.join(', ');

    // Adjust the textarea heights based on the initial content
    adjustTextareaHeight(allowTagsInput);
    adjustTextareaHeight(denyTagsInput);
  });

  // Select All checkbox event listener
  document.getElementById('selectAll').addEventListener('change', function(event) {
    var isChecked = event.target.checked;
    var categoryCheckboxes = document.querySelectorAll('input[name="categories"]');

    categoryCheckboxes.forEach(function(checkbox) {
      checkbox.checked = isChecked;
    });
  });
};

// Retrieve the saved API key and update the input field
chrome.storage.sync.get('apiKey', function(data) {
  var apiKey = data.apiKey;
  var apiKeyInput = document.getElementById('api-key');

  // Check if the API key is available
  if (apiKey) {
    apiKeyInput.value = '**********'; // Display asterisks as a placeholder
  }
});

// Listen for changes in the API key input field
apiKeyInput.addEventListener('input', function(event) {
  // Get the entered API key value
  var apiKey = event.target.value;

  // Save the API key
  chrome.storage.sync.set({ apiKey: apiKey }, function() {

  });
});
