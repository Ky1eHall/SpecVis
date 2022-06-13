import axios from 'axios'
import React, {useState} from 'react';
// import Highlight from 'react-highlight';
import { CodeBlock } from "react-code-blocks";
import qmark from './qmark.svg';
import {
  Tooltip,
  SimpleGrid,
  Box,
  Flex
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons'


var codeThing = () =>
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import librosa
import librosa.display
import numpy as np

# Path is the os.Path object that leads to your image file
y, sr = librosa.load(path)
mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=${document.getElementById("n_fft").value}, win_length=${document.getElementById("win_val").value})
M_db = librosa.power_to_db(mel_spec, ref=np.max)

# To display and save using matplotlib
p = plt.figure(num=None, figsize=(8, 6))
p2 = plt.subplot(111)
p3 = plt.axis('on')
p4 = plt.subplots_adjust(left=0,right=1, bottom=0, top=1)
p5 = librosa.display.specshow(M_db, sr=sr)
p6 = plt.savefig("your_output_path.jpg", format='jpg') 
p7 = plt.close()
`

var codeThing2 = () =>
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

mel_spec = MATPLOT!!!!(y=y, sr=sr, n_fft=${document.getElementById("n_fft").value}, win_length=${document.getElementById("win_val").value})
M_db = librosa.power_to_db(mel_spec, ref=np.max)

# To display and save using matplotlib
p = plt.figure(num=None, figsize=(8, 6))
p2 = plt.subplot(111)
p3 = plt.axis('on')
p4 = plt.subplots_adjust(left=0,right=1, bottom=0, top=1)
p5 = librosa.display.specshow(M_db, sr=sr)
p6 = plt.savefig("your_output_path.jpg", format='jpg') 
p7 = plt.close()
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
        formData.append("library", document.getElementById("libraries").value);
        formData.append("axes", document.getElementById("axes").checked)
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

    function setDisabledElements(value) {
      console.log("the value from select")
      console.log(value)
      if (value === "matplotlib") {
        document.getElementById("win_val").disabled = true
      }
      if (value === "librosa") {
        document.getElementById("win_val").disabled = false  
      }
    }

  
    return (
      <Flex
      align={'center'}
      justify={'center'}
      p={8} flex={1}>
      <SimpleGrid columns={2} spacing={10} >

        {/* <div className='box1'> */}
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={8}>
          { spectrogram === undefined ? 
            <div>Placeholder for preamble. <br></br> Is replaced by codegen once spectrogram is made</div> :
            <div style={{display:'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
              <button style={{alignSelf: 'flex-start'}} className='backButton' onClick={() => goBack()}>Restart</button>  
              <div className="codeBlock"> 
                <CodeBlock
                  text={ document.getElementById("libraries").value === "librosa" ? codeThing() : codeThing2() }
                  codeBlock={true}
                  language="python"
                  showLineNumbers={true}
                  wrapLines={true}
                />
              </div>
            </div>
          }
        </Box>
        {/* </div> */}
        {/* <div className="box2"> */}
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={8}>
          <div className='formContainer'>
            <form className="form">
              <div className='formElement'>
                <label for="audio">N_fft parameter: </label>
                  {/* <i className='tooltip' src={qmark} width='25px'/>Test
                    <span>Tooltip text</span>: */}
                  {/* <Tooltip hasArrow label='Info' bg='gray.300' color='black'>
                      <QuestionOutlineIcon/>
                  </Tooltip> */}
                  <Tooltip hasArrow label='RThe value that does this thing' bg='gray.300' color='black'>
                    <input type="number" id="n_fft" defaultValue={1024} name="audio"/>
                </Tooltip>
              </div>
              <div className='formElement'>
                <label for="win_val">Win length: </label>
                <input type="number" id="win_val" defaultValue={1024} name="win_val" disabled={false}/>
              </div>
              <div className='formElement'>
                <label for="axes">Axes: </label>
                <input type="checkbox" id="axes" defaultValue={false} name="axes" value="true"/>
              </div>
              <div className='formElement'>
                <label for="libraries">Libraries:  </label>
                <select name="libraries" id="libraries" onInput={() => setDisabledElements(document.getElementById("libraries").value)}>
                    <option value="librosa">Librosa</option>
                    <option value="matplotlib">Matplotlib</option>
                </select>
              </div>
              <div className='formElement'>
                <label>Upload your sound file</label>
                <input type="file" id="audio" accept='audio/wav' onInput={() => setUploadedAudio(true)}></input>
              </div>
            </form>
          </div>
          <div>
           
            {hasUploadedAudio && <button disabled={isSending} onClick={() => {getSpectrogram()}}>Make Spectrogram</button>}
            {isSending && <h2>Loading</h2>}
          </div>
            {spectrogram !== undefined && 
                <img className='specImage' src={spectrogram} alt="test"/>
            }
        {/* </div> */}
        </Box>
    </SimpleGrid>
    </Flex>
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