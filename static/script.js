document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const input = document.getElementById('qr-input');
    const resultSection = document.getElementById('result-section');
    const qrImage = document.getElementById('qr-image');
    const downloadBtn = document.getElementById('download-btn');

    if (input) input.focus();

    generateBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return alert('Please enter text');

        // Update URLs
        const dataParam = `?data=${encodeURIComponent(text)}`;
        qrImage.src = `/generate${dataParam}`;
        downloadBtn.href = `/download${dataParam}`;

        // Show result
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });
});
