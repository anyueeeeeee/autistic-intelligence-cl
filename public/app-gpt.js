window.addEventListener('load', () => {

    // Chat with GPT
    document.getElementById('gptForm').addEventListener('submit', async (e) => {
        e.preventDefault();
      
        const prompt = document.getElementById('prompt').value;
        const responseDiv = document.getElementById('response');
      
        responseDiv.innerHTML = 'translating...';
      
        try {
          const response = await fetch('/api/gpt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
          });
      
          const data = await response.json();
          if (response.ok) {
            responseDiv.innerHTML = `<p id = "response">${data.response}</p>`;
          } else {
            responseDiv.innerHTML = `<p>Error: ${data.error}</p>`;
          }
        } catch (error) {
          responseDiv.innerHTML = `<p>Error: Failed to fetch the response.</p>`;
        }
      });
    
    });
    