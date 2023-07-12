window.onload = function () {
    var questionsContainer = document.getElementById('questions-container');
  
    // Fetch the questions and answers from the text file
    fetch('../html/questions.txt')
      .then(response => response.text())
      .then(data => {
        // Split the text file content into an array of lines
        var lines = data.split('\n');
  
        var question = '';
        var answer = '';
  
        // Iterate through each line of the text file
        lines.forEach(line => {
          // If the line is not empty, check if it is a question or an answer
          if (line.trim() !== '') {
            if (question === '') {
              question = line.trim();
            } else if (answer === '') {
              answer = line.trim();
  
              // Create HTML elements for the question-answer pair
              var questionElement = document.createElement('div');
              questionElement.className = 'question';
              questionElement.textContent = question;
  
              var answerElement = document.createElement('div');
              answerElement.className = 'answer';
              answerElement.textContent = answer;
  
              // Add event listener to toggle the answer visibility on click
              questionElement.addEventListener('click', function () {
                answerElement.classList.toggle('show');
              });
  
              // Append question and answer elements to the container
              questionsContainer.appendChild(questionElement);
              questionsContainer.appendChild(answerElement);
  
              // Reset question and answer variables for the next pair
              question = '';
              answer = '';
            }
          }
        });
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  };
  
  document.getElementById('feedback-button').addEventListener('click', function() {
    window.open('https://github.com/karinadalca/activefocus-youtube-filter/issues', '_blank');
  });
