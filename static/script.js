document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const input = document.getElementById('qr-input');
    const resultSection = document.getElementById('result-section');
    const qrcodeContainer = document.getElementById('qrcode-container');
    const downloadBtn = document.getElementById('download-btn');

    if (input) input.focus();

    generateBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) {
            alert('Please enter a link or text');
            return;
        }

        // Show loading state
        generateBtn.classList.add('loading');
        generateBtn.innerText = 'Generating...';

        // Clear previous QR
        qrcodeContainer.innerHTML = '';

        // Generate basic QR on hidden element
        const tempDiv = document.createElement('div');
        new QRCode(tempDiv, {
            text: text,
            width: 900,
            height: 900,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Wait for QR to be rendered
        setTimeout(() => {
            const qrCanvas = tempDiv.querySelector('canvas');
            if (!qrCanvas) return;

            const size = 900;
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = size;
            finalCanvas.height = size;
            const ctx = finalCanvas.getContext('2d');

            // Create Diagonal Gradient
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#ffc837'); // yellow-orange
            gradient.addColorStop(0.33, '#ff306c'); // pink-magenta
            gradient.addColorStop(0.66, '#833ab4'); // purple
            gradient.addColorStop(1, '#5851db'); // violet-blue

            const qrCtx = qrCanvas.getContext('2d');
            const imgData = qrCtx.getImageData(0, 0, size, size);
            const pixels = imgData.data;

            // Draw Background Gradient (Subtle)
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.06; // Very faint background
            ctx.fillRect(0, 0, size, size);
            ctx.globalAlpha = 1.0;

            // Apply logic: Dark pixels get gradient, light pixels stay faint
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = size;
            tempCanvas.height = size;
            const tCtx = tempCanvas.getContext('2d');
            
            // Draw gradient on temp canvas
            tCtx.fillStyle = gradient;
            tCtx.fillRect(0, 0, size, size);
            const gradData = tCtx.getImageData(0, 0, size, size).data;

            // Create resulting image data
            const resultImgData = ctx.createImageData(size, size);
            for (let i = 0; i < pixels.length; i += 4) {
                const isDark = pixels[i] < 128; // Check red channel
                if (isDark) {
                    resultImgData.data[i] = gradData[i];
                    resultImgData.data[i+1] = gradData[i+1];
                    resultImgData.data[i+2] = gradData[i+2];
                    resultImgData.data[i+3] = 255;
                } else {
                    // Subtle background blend
                    resultImgData.data[i] = 255 - (255 - gradData[i]) * 0.06;
                    resultImgData.data[i+1] = 255 - (255 - gradData[i+1]) * 0.06;
                    resultImgData.data[i+2] = 255 - (255 - gradData[i+2]) * 0.06;
                    resultImgData.data[i+3] = 255;
                }
            }

            ctx.putImageData(resultImgData, 0, 0);

            // Display final result
            finalCanvas.style.maxWidth = '100%';
            finalCanvas.style.height = 'auto';
            finalCanvas.style.borderRadius = '0.5rem';
            qrcodeContainer.appendChild(finalCanvas);

            // Set up download link
            downloadBtn.href = finalCanvas.toDataURL('image/png');
            
            // Reset button
            generateBtn.classList.remove('loading');
            generateBtn.innerText = 'Generate Code';
            
            // Show result section
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    });
});
