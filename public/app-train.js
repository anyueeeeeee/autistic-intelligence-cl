window.addEventListener('load', () => {
    let userIdentity = null; // Variable to store user identity
    const identityFeedback = document.getElementById('identityFeedback'); 

    function handleButtonClick(button, identity) {

        document.getElementById('autisticButton').classList.remove('clicked');
        document.getElementById('allisticButton').classList.remove('clicked');

        button.classList.add('clicked');
        userIdentity = identity;
    }

    // Event listener for "I am Autistic" button
    document.getElementById('autisticButton').addEventListener('click', () => {
        handleButtonClick(document.getElementById('autisticButton'), 'autistic');
    });

    // Event listener for "I am Allistic" button
    document.getElementById('allisticButton').addEventListener('click', () => {
        handleButtonClick(document.getElementById('allisticButton'), 'allistic');
    });

    // Submit Training Data
    document.getElementById('trainingForm').addEventListener('submit', async (e) => {
        e.preventDefault();
      
        const trainingPrompt = document.getElementById('trainingPrompt').value;
        const trainingCompletion = document.getElementById('trainingCompletion').value;
        const trainingResponseDiv = document.getElementById('trainingResponse');
      
        if (!userIdentity) {
            trainingResponseDiv.innerHTML = 'Please identify yourself as autistic or allistic before submitting.';
            return;
        }
      
        trainingResponseDiv.innerHTML = 'Submitting...';
      
        try {
            const response = await fetch('/api/submit-training-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: trainingPrompt, 
                    completion: trainingCompletion, 
                    identity: userIdentity 
                }),
            });
      
            const data = await response.json();
            if (response.ok) {
                trainingResponseDiv.innerHTML = `<p>${data.message}</p>`;
            } else {
                trainingResponseDiv.innerHTML = `<p>Error: ${data.error}</p>`;
            }
        } catch (error) {
            trainingResponseDiv.innerHTML = `<p>Error: Failed to submit training data.</p>`;
        }
    });
  
    // View Training Data
    document.getElementById('viewTrainingData').addEventListener('click', async () => {
        const trainingDataContainer = document.getElementById('trainingDataContainer');
        trainingDataContainer.innerHTML = 'Loading...';

        try {
            const response = await fetch('/api/training-data', { method: 'GET' });
            const data = await response.json();

            if (response.ok) {
                // Clear the container and display the training data
                trainingDataContainer.innerHTML = '';
                data.trainingData.forEach((entry, index) => {
                    const entryDiv = document.createElement('div');
                    entryDiv.innerHTML = `
                        <h3><strong>Entry ${index + 1}</strong></h3>
                        <h3><strong>Prompt:</strong> ${entry.prompt}</h3>
                        <h3><strong>Completion:</strong> ${entry.completion}</h3>
                        <h3><strong>Identity:</strong> ${entry.identity}</h3>
                        <hr>
                    `;
                    trainingDataContainer.appendChild(entryDiv);
                });
            } else {
                trainingDataContainer.innerHTML = `<p>Error: ${data.error}</p>`;
            }
        } catch (error) {
            trainingDataContainer.innerHTML = `<p>Error: Unable to fetch training data.</p>`;
        }
    });
});