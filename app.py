from flask import Flask, render_template, request, send_file
import qrcode
import io
import base64
from PIL import Image, ImageDraw

app = Flask(__name__, template_folder="E:/QR Code Generator")

def generate_qr(data, size=900):
    # Base QR (black & white)
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
    qr_img = qr_img.resize((size, size), Image.NEAREST)

    # Instagram-style gradient
    gradient = Image.new("RGBA", (size, size))
    draw = ImageDraw.Draw(gradient)

    colors = [
        (255, 200, 55),   # yellow-orange
        (255, 48, 108),   # pink-magenta
        (131, 58, 180),   # purple
        (88, 81, 219),    # violet-blue
    ]

    for i in range(size):
        t = i / size
        c1 = colors[int(t * (len(colors) - 1))]
        c2 = colors[min(int(t * (len(colors) - 1)) + 1, len(colors) - 1)]
        ratio = (t * (len(colors) - 1)) % 1
        r = int(c1[0] + (c2[0] - c1[0]) * ratio)
        g = int(c1[1] + (c2[1] - c1[1]) * ratio)
        b = int(c1[2] + (c2[2] - c1[2]) * ratio)
        draw.line([(0, i), (size, i)], fill=(r, g, b, 255))

    # Apply gradient only on dark modules
    for y in range(size):
        for x in range(size):
            if qr_img.getpixel((x, y))[0] < 128:
                qr_img.putpixel((x, y), gradient.getpixel((x, y)))

    return qr_img

@app.route('/', methods=['GET', 'POST'])
def index():
    qr_base64 = None
    link = None
    if request.method == 'POST':
        link = request.form.get('link')
        if link:
            img = generate_qr(link)
            buf = io.BytesIO()
            img.save(buf, format='PNG')
            qr_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    return render_template('index.html', qr_base64=qr_base64, link=link)

@app.route('/download')
def download():
    link = request.args.get('link')
    if not link:
        return "No link provided", 400
    
    img = generate_qr(link)
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png', as_attachment=True, download_name='qrcode.png')

if __name__ == '__main__':
    from livereload import Server
    server = Server(app.wsgi_app)
    server.watch('index.html')
    server.watch('static/')
    server.serve(port=5000, debug=True)
