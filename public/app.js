window.addEventListener('load', () => {

    const button = document.querySelector(".button"); // "but why" button
    const targetSection = document.querySelector("#why-section");
    const textElement = targetSection.querySelector("p");
    const hiddenButtons = document.querySelectorAll(".hidden-button"); // Buttons to show after typing

    // Typewriter Effect
    function typewriterEffect(element, text, speed = 30, callback) {
        let index = 0;

        function type() {
            if (index < text.length) {
                element.innerHTML += text[index]; // Add one character at a time
                index++;
                setTimeout(type, speed);
            } else if (callback) {
                callback(); // Call the callback when typing is done
            }
        }

        type();
    }

    button.addEventListener("click", () => {
        // Scroll to the why-section
        targetSection.scrollIntoView({ behavior: "smooth" });

        // Start typewriter effect
        const fullText = textElement.innerHTML; // Get full text
        textElement.innerHTML = ""; // Clear the text
        textElement.style.visibility = "visible"; // Make the text element visible

        // Start typing and show buttons when done
        typewriterEffect(textElement, fullText, 50, () => {
            hiddenButtons.forEach(btn => {
                btn.style.display = "inline-block";
                btn.style.opacity = 1; 
                btn.style.animation = "fadeIn 0.3s forwards, blink 0.25s 2 linear"; 
            });
        });
    });

});
