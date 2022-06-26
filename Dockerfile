# Based on blog post from https://blog.miguelgrinberg.com/post/how-to-dockerize-a-react-flask-project
# Build step #1: build the React front end
FROM node:16-alpine as build-step
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY ./frontend/package.json ./frontend/package-lock.json ./
COPY ./frontend/src ./src
COPY ./frontend/public ./public
RUN yarn install
RUN yarn build

# Build step #2: build the API with the client as static files
# See: https://docs.docker.com/develop/develop-images/multistage-build/ from more info
# Not using alpine here: https://pythonspeed.com/articles/alpine-docker-python/ Very slow builds, lot of dependencies.
# Python3.10 also appears to have some issues with scipy and issues like: "RuntimeError: Broken toolchain: cannot link a simple C program numpy"
# when attempting to compile. Reverting down works with current dependencies.
FROM python:3.8-slim
WORKDIR /app
COPY --from=build-step /app/build ./frontend/build

RUN mkdir ./api
COPY requirements.txt app.py ./
COPY ./backend/api/api.py ./backend/api/clackLaptop.wav ./backend/api/
# See: https://stackoverflow.com/questions/22388519/problems-with-pip-install-numpy-runtimeerror-broken-toolchain-cannot-link-a
# We need ffmpeg and libsndfile-dev for librosa/matplotlib to work - this requires some extra c compiler deps in alpine to work
RUN apt-get update
# This is chonky, but we don't really care about super efficient builds. -y and just accept all recommendatios
RUN apt-get install -y ffmpeg
RUN apt-get install -y libsndfile1-dev
RUN pip install --upgrade pip
RUN pip install -r ./requirements.txt

ENV FLASK_ENV=production

EXPOSE 3000
CMD ["gunicorn", "-b", ":3000", "app:app"]
