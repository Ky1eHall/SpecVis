import matplotlib
matplotlib.use('Agg')
from flask_restful import Api, Resource, reqparse
from flask import request, send_file
import scipy.io.wavfile as wav
import wave
import matplotlib.pyplot as plt
import random
import librosa
import librosa.display
import numpy as np
import os
import io

parser = reqparse.RequestParser()

class ApiHandler(Resource):
   
    # def get(self):
    #     return {
    #         'resultStatus': 'SUCCESS',
    #         'message': "Backend connection successful!"
    #     }

    
    def get(self, file_name):
        print(file_name)
        return send_file(file_name + '.jpg', mimetype = 'image/jpg', as_attachment=True)

    # Using to accept audio file, create spectrogram, and return.
    def post(self):

        
        audio_file = request.files["audio_file"]
        n_fft_val = int(request.form["n_fft"])
        win_val = int(request.form["win_val"])
        n_fft_val = int(n_fft_val)
        print(n_fft_val)
        print(win_val)
        file_name = str(random.randint(0,100000)) + ".wav"
        audio_file.save(file_name)

        # wav = wave.open(file_name, 'rb')
        # frames = wav.readFrames(-1)
        # sound_info = np.frombuffer(frames, 'int16')
        # frame_rate = wav.getframerate()
        # print(frame_rate)
        # wav.close()

        path = os.fspath(file_name)
        y, sr = librosa.load(path)
        os.remove(file_name)

        mel_speccy = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=n_fft_val, win_length=win_val)
        M_db = librosa.power_to_db(mel_speccy, ref=np.max)

        p = plt.figure(num=None, figsize=(8, 6))
        p2 = plt.subplot(111)
        p3 = plt.axis('on')
        p4 = plt.subplots_adjust(left=0,right=1, bottom=0, top=1)
        p5 = librosa.display.specshow(M_db, sr=sr)
        # plt.specgram()
        # Saving locally, need to remove this file after the return as well
        temp_file_prefix = random.randint(0,1000000)
        file_path = str(temp_file_prefix) + '.jpg'
        p6 = plt.savefig(file_path, format='jpg') 
        p7 = plt.close()

        # From https://stackoverflow.com/questions/24612366/delete-an-uploaded-file-after-downloading-it-from-flask
        # Idea is keep the file in memory, then delete off disk while file still in memory.
        # Could spawn another background process, but apparently spawning the background progress blocks longer.
        return_data = io.BytesIO()
        with open(file_path, 'rb') as fo:
            return_data.write(fo.read())
        # Return cursor to the start, cause after read its at the end.
        return_data.seek(0)
        # Remove from local file system, still in mem.
        os.remove(file_path)

        return send_file(return_data, mimetype = 'image/jpg', as_attachment=True, download_name='SpectrogramVersion.jpg') # temp_file_prefix