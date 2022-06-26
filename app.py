# To start server:
# Open a new command prompt and navigate to the directory this file is in
# Activate the virtual env as necessary
# To activate venv: venv/Scripts/Activate.bat
# flask run to start server  

# set FLASK_DEBUG=1 
 
from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from backend.api.api import ApiHandler

from flask_cors import CORS # When experimenting locally, prevent CORS errors.

app = Flask(__name__, static_url_path='/', static_folder='frontend/build')
CORS(app) # When experimenting locally - comment out on deployment
api = Api(app)

@app.route("/", defaults={'path':''})
def serve(path):
    #return "Spectrogram Visualiser  "
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/check")
def test_backend_connection():
    return {
            'resultStatus': 'SUCCESS',
            'message': "Backend connection successful!"
        }

api.add_resource(ApiHandler, '/flask/check', '/flask/check/<file_name>')   

if __name__ == '__main__':
    app.debug = True
    app.run()