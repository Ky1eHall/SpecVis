# SpectrogramVisualiser

If using this app from scratch, see `requirements.txt` for required packages, or create a python virtual environment and install the requirements. You may need to install pip (`python3 -m pip install --upgrade pip`), or `py` as alias before creating a virtual env.

One way you can do so: 
Change directory to this repo and execute: `python venv venv` or `python virtualenv venv` to create a new virtual environment, `venv\Scripts\activate.bat` to enter the virtual environment, then `pip install -r requirements.txt`. Use `deactivate` to exit the virtual environment.

You'll need to install ffmpeg as well if running on your local machine.

This app has being containerised to be deployed and to work cross-platform.
In this directory run `docker build -f dockerfile.fulltstack -t react-flask-app .` to build the image, then `docker run --rm -p 3000:3000 react-flask-app` to run a container - go to `localhost:3000` to see the app running. This will take some time to finish on the first run (5-10 mins), but will run on any platform and can be deployed in a production env.

To run locally without the container (good when developing as enables hot reloading on both frontend and backend):
1. First change dir into frontend and run `npm install` then run `npm start`. This will start the frontend server on `localhost:3000`. Note that in the `package.json` the `proxy` has been set to `localhost:5000` - this redirects `localhost:3000/...` calls to port 5000
2. Start up the backend server by running `py app.py` (or `python app.py` depending on what you're python shortcut is, may depend on installed version and OS). You need to ru the `app.py` file as it will prevent CORS errors happening due to using multiple ports locally.

