import axios from 'axios'
import React, {useState} from 'react';
import { CodeBlock } from "react-code-blocks";
import {
  Button,
  Text,
  Tooltip,
  SimpleGrid,
  Box,
  FormLabel,
  Stack,
  FormControl,
  NumberInput,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  NumberInputField,
  Select,
  Switch,
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
    const [caughtError, setError] = useState(false)

    // https://stackoverflow.com/questions/14551194/how-are-parameters-sent-in-an-http-post-request
    // Sending the extra stuff as part of the form data.
    function getSpectrogram(local) {
        setIsSending(true); // Renable the ability to send/options
        setError(false); // If previous error caught, reset to remove text.
        setSpectrogram(undefined)  // Remove any existing spectrogram

        var formData = new FormData();
        var audioFiles = undefined
        if (local === true) {
          formData.append("default_file", "true")
        } else {
          formData.append("default_file", "false")
          audioFiles = document.querySelector('#audio')
          formData.append("audio_file", audioFiles.files[0]);
        }
        //var audioFiles = document.querySelector('#audio')
        
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
            setSpectrogram(specUrl)
            setIsSending(false);
          }).catch(function (error) {
            console.log(error.toJSON());
            setIsSending(false);
            setError(true);
          });
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
      <Stack
      // align={'center'}
      // justify={'center'}
      p={8} flex={1}>
      <SimpleGrid minChildWidth='200px'  spacing={8} >
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={8}>
          { spectrogram === undefined ? 
            <Text>Placeholder for preamble. <br></br> Is replaced by codegen once spectrogram is made</Text> :
            <Box style={{display:'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
              <Button style={{alignSelf: 'flex-start'}} className='backButton' onClick={() => goBack()}>Restart</Button> 
              <Box p={5}> 
                <CodeBlock
                  text={ document.getElementById("libraries").value === "librosa" ? codeThing() : codeThing2() }
                  codeBlock={true}
                  language="python"
                  showLineNumbers={true}
                  wrapLines={true}
                />
              </Box>
            </Box>
          }
        </Box>
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={3} paddingBottom={5}>
              <Box>
                <FormControl id="n_fft_label">
                  <FormLabel>N_fft parameter</FormLabel>
                  <NumberInput defaultValue={1024} min={256} max={4096} id="n_fft">
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="win_val_label">
                  <FormLabel>Window Length: </FormLabel>
                  <NumberInput defaultValue={1024} min={256} max={4096} id="win_val" disabled={false}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Box>
               <Box>
                <FormControl id="win_val_label">
                  <FormLabel>Libraries: </FormLabel>
                  <Select id="libraries" onInput={() => setDisabledElements(document.getElementById("libraries").value)}>
                    <option value="librosa">Librosa</option>
                    <option value="matplotlib">Matplotlib</option>
                  </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl display='flex' alignItems='center'>
                    <FormLabel htmlFor='axes_label' mb='0'>
                      Axes on output
                    </FormLabel>
                    <Switch id='axes' />
                  </FormControl>
                </Box>
                <Box>
                <FormControl display='flex' alignItems='center'>
                 <FormLabel htmlFor='upload_label' mb='0'>
                   Upload your sound file
                 </FormLabel>
                  <input type="file" id="audio" accept='audio/wav' onInput={() => setUploadedAudio(true)}></input>
                  </FormControl>
                </Box>
            </Stack>
          <Box justify={'center'} align={'center'} p={2}>

            {hasUploadedAudio ? <Button disabled={isSending} onClick={() => {getSpectrogram(false)}} colorScheme='blue'>Make Spectrogram</Button> :
              <Button disabled={isSending} onClick={() => {getSpectrogram(true)}}>Try with default sound file</Button>
            }
            {isSending && <Text paddingTop={5}>Creating your spectrogram now...</Text>}
          </Box>
          <Box align={'center'}>
            {spectrogram !== undefined && <Box p={2}><img className='specImage' src={spectrogram} alt="test"/></Box>}
            {caughtError && <Box p={10}> Opps, an error occurred, try again </Box>}
          </Box>
        </Box>
    </SimpleGrid>
    </Stack>
  )
}

export default SpecContainer