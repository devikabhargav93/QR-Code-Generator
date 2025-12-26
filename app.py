from flask import Flask, render_template, request, send_file
import qrcode
import io
import base64

app = Flask(__name__)

def generate_qr(data):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    return img

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
    server.watch('templates/')
    server.watch('static/css/')
    server.watch('static/js/')
    server.serve(port=5000, debug=True)
