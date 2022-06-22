from cProfile import label
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
import soundfile as sf

parser = reqparse.RequestParser()

class ApiHandler(Resource):
    
    def get(self, file_name):
        print(file_name)
        return send_file(file_name + '.jpg', mimetype = 'image/jpg', as_attachment=True)

    # Using to accept audio file, create spectrogram, and return.
    def post(self):
        library_choice = request.form["library"]

        return_data = io.BytesIO()

        if library_choice == "matplotlib":
            handleMatplotlibSpec(return_data, request)

        if library_choice == "librosa":
            handleLibrosaSpec(return_data, request)

        return send_file(return_data, mimetype = 'image/jpg', as_attachment=True, download_name='SpectrogramVersion.jpg') # temp_file_prefix


def retreiveSpectrogramData(request):
    if request.form["default_file"] == "true":
        file_name = "./backend/api/clackLaptop.wav"
    else:
        audio_file = request.files["audio_file"]
        file_name = str(random.randint(0,100000)) + ".wav"
        audio_file.save(file_name)


    path = os.fspath(file_name)
    y, sr = librosa.load(path)

    if request.form["default_file"] != "true":
        os.remove(file_name)

    return y, sr


def handleLibrosaSpec(return_data, request):
    win_val = int(request.form["win_val"])
    n_fft_val = int(request.form["n_fft"])

    y, sr = retreiveSpectrogramData(request)

    mel_speccy = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=n_fft_val, hop_length=512, win_length=win_val)
    M_db = librosa.power_to_db(mel_speccy, ref=np.max)

    # p = plt.figure(num=None, figsize=(8, 6))
    p2 = plt.subplot(111)
    if (str(request.form['axes'])) == "false":
        p4 = plt.subplots_adjust(left=0,right=1, bottom=0, top=1)
        p5 = librosa.display.specshow(M_db, sr=sr)
    else:
        p5 = librosa.display.specshow(M_db, sr=sr, y_axis='mel', x_axis='time',)
        p6 = plt.colorbar(label="dB")
    
    # Saving locally, need to remove this file after the return as well
    temp_file_prefix = random.randint(0,1000000)
    file_path = str(temp_file_prefix) + '.jpg'
    p6 = plt.savefig(file_path, format='jpg') 
    p7 = plt.close()

    # From https://stackoverflow.com/questions/24612366/delete-an-uploaded-file-after-downloading-it-from-flask
    # Idea is keep the file in memory, then delete off disk while file still in memory.
    # Could spawn another background process, but apparently spawning the background progress blocks longer.
    # return_data = io.BytesIO()
    with open(file_path, 'rb') as fo:
        return_data.write(fo.read())
    # Return cursor to the start, cause after read its at the end.
    return_data.seek(0)
    # Remove from local file system, still in mem.
    os.remove(file_path)


def handleMatplotlibSpec(return_data, request):
    # Read the wav file (mono)
    
    n_fft_val = int(request.form["n_fft"])

    y, sr = retreiveSpectrogramData(request)

    # Plot the signal read from wav file
    # p = plt.subplot(211)
    # p =plt.plot(y)
    p = plt.subplot(111)

    
    #  p =plt.subplot(212)
    #p = plt.figure(num=None, figsize=(8, 6))
    
    
    # p = plt.subplots_adjust(left=0,right=1,bottom=0,top=1)
    p = plt.specgram(y,Fs=sr,NFFT=n_fft_val)
    # p =plt.xlabel('Time')
    # p =plt.ylabel('Frequency')

    # p = plt.axes([0., 0., 1., 1.])
    if (str(request.form['axes'])) == "false":
        print("checking got here")
        p = plt.axis('off')
    else:
        p = plt.title('Spectrogram using matplotlib (not mel-spectrogram)')
        p =plt.xlabel('Time')
        p =plt.ylabel('Frequency')
        p = plt.colorbar(label="dB")

    # plt.axis('off')
    p = plt.show()
    
    temp_file_prefix = random.randint(0,1000000)
    file_path = str(temp_file_prefix) + '.jpg'

    p = plt.savefig(file_path, format='jpg', bbox_inches='tight') 
    p = plt.close()

    with open(file_path, 'rb') as fo:
        return_data.write(fo.read())

    return_data.seek(0)
    # Remove from local file system, still in mem.
    os.remove(file_path)