from flask import Flask, render_template, request, send_file
import qrcode
from io import BytesIO

app = Flask(__name__)

def create_qr_image(data):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    return qr.make_image(fill_color="black", back_color="white")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate')
def generate():
    data = request.args.get('data', '')
    if not data:
        return "No data provided", 400
    
    img = create_qr_image(data)
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    
    return send_file(img_io, mimetype='image/png')

@app.route('/download')
def download():
    data = request.args.get('data', '')
    if not data:
        return "No data provided", 400
    
    img = create_qr_image(data)
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    
    return send_file(
        img_io, 
        mimetype='image/png', 
        as_attachment=True, 
        download_name='qrcode.png'
    )

if __name__ == '__main__':
    app.run(debug=True)
