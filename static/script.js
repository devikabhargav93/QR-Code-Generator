document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const button = document.querySelector('button');
    const input = document.querySelector('input[type="text"]');

    if (form) {
        form.addEventListener('submit', () => {
            // Add loading state to button
            button.classList.add('loading');
            button.innerHTML = 'Generating...';
        });
    }

    // Auto-focus input on page load
    if (input) {
        input.focus();
    }
    
    // Smooth appearance for the result section if it exists
    const result = document.querySelector('.result');
    if (result) {
        console.log('QR Code generated successfully!');
    }
});
