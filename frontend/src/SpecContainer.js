import axios from 'axios'
import React, {useState} from 'react';

function SpecContainer() {
    // return <img src={props} alt="test"/>
    const [spectrogram, setSpectrogram] = useState();
    const [hasUploadedAudio, setUploadedAudio] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // https://stackoverflow.com/questions/14551194/how-are-parameters-sent-in-an-http-post-request
    // Sending the extra stuff as part of the form data.
    function getSpectrogram() {
        // Will first use a specific audio file, but later will enable selecting a file, or specifying users own.
        setIsSending(true); // Renable the ability to send/options
        var formData = new FormData();
        var audioFiles = document.querySelector('#audio')
        formData.append("audio_file", audioFiles.files[0]);
        formData.append("n_fft", document.getElementById("n_fft").value);
        console.log(document.getElementById("n_fft").value)
        console.log(formData)
        axios.post('http://localhost:5000/flask/check', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }, 
            responseType: 'blob',
          }).then(res => {
            var specUrl = URL.createObjectURL(res.data)
            console.log(specUrl)
            console.log(res.data)
            //return (<img src={specUrl} alt="testing" />)
            setSpectrogram(specUrl)
            setIsSending(false);
          })
    }

    return (
        <div className="App">
        <header className="App-header">
        <div>
          <div>
            N_fft parameter:  
            <input type="number" id="n_fft"></input>
          </div>
            <div>
            <input type="file" id="audio" accept='audio/wav' onInput={() => setUploadedAudio(true)}></input>
            {hasUploadedAudio && <button disabled={isSending} onClick={() => {getSpectrogram()}}>Send audio file</button>}
            </div>
            {spectrogram !== undefined && 
                <img src={spectrogram} alt="test"/>
            }
        </div>
        </header>
    </div>
  )
}

export default SpecContainer


// }).then(response => {
    //   console.log(response)
    //   // Should double check its an img type.
    //   axios.get('http://localhost:5000/flask/check/test_speccy.jpg', {responseType: 'blob'}).then(res => {
    //     var specUrl = URL.createObjectURL(res.data)
    //     console.log(specUrl)
    //     console.log(res.data)
    //     //return (<img src={specUrl} alt="testing" />)
    //     setSpectrogram(specUrl)
    //   })
      