import axios from 'axios'
import React, {useState} from 'react';
// import Highlight from 'react-highlight';
import { CodeBlock } from "react-code-blocks";

var codeThing = 
`print("hello world")
if this:
  do this
  check n_fft - ${document.getElementById("n_fft").value}
`

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

        // Remove any existing spectrogram:
        setSpectrogram(undefined)
        var formData = new FormData();
        var audioFiles = document.querySelector('#audio')
        formData.append("audio_file", audioFiles.files[0]);
        formData.append("n_fft", document.getElementById("n_fft").value);
        formData.append("win_val", document.getElementById("win_val").value);
        console.log(document.getElementById("n_fft").value)
        console.log(formData)
        axios.post('http://localhost:5000/flask/check', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }, 
            responseType: 'blob',
          }).then(res => {
            var specUrl = URL.createObjectURL(res.data)
            console.log(res)
            console.log(specUrl)
            console.log(res.data)
            //return (<img src={specUrl} alt="testing" />)
            setSpectrogram(specUrl)
            setIsSending(false);
          })
    }

    function goBack() {
      setSpectrogram(undefined)
      setUploadedAudio(false)
      document.getElementById('audio').value = ''
    }

    return (
      <div className="SpecContainer">
        <div className='box1'>
  
          { spectrogram === undefined ? 
            <div>Placeholder for preamble. <br></br> Is replaced by codegen once spectrogram is made</div> :
            <div style={{display:'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
              <button style={{alignSelf: 'flex-start'}} className='backButton' onClick={() => goBack()}>Restart</button>  
              <div className="codeBlock"> 
              <CodeBlock
                text={codeThing}
                // `print("hello world")\n
                //  if solved: \n     some extra lines`
                // }
                codeBlock={true}
                language="python"
                showLineNumbers={true}
                wrapLines={true}
              />
              </div>
            </div>
          }
        </div>
        <div className="box2">
          <div>
            <form>
              <div className='formElement'>
                <label for="audio">N_fft parameter: </label>
                <input type="number" id="n_fft" defaultValue={1024} name="audio"/>
              </div>
              <div className='formElement'>
                <label for="win_val">Win length: </label>
                <input type="number" id="win_val" defaultValue={1024} name="win_val"/>
              </div>
              <div className='formElement'>
                
              </div>
            </form>
          </div>
          <div>
            <input type="file" id="audio" accept='audio/wav' onInput={() => setUploadedAudio(true)}></input>
            {hasUploadedAudio && <button disabled={isSending} onClick={() => {getSpectrogram()}}>Send audio file</button>}
            {isSending && <h2>Loading</h2>}
          </div>
            {spectrogram !== undefined && 
                <img className='specImage' src={spectrogram} alt="test"/>
            }
        </div>
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
      

  //   <Highlight language="python">
  //   {"function foo() { " + 
  //   "return " + document.getElementById("n_fft").value +
  //   "return" + document.getElementById("win_val").value + 
  //   "}"}
  // </Highlight>