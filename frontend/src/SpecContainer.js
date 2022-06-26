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
  Link,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons'


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

# Using librosa to load in, but there are other libraries such as wave
y, sr = librosa.load(path)

# To display and save using matplotlib
p = plt.figure(num=None, figsize=(8, 6))
p2 = plt.subplot(111)
p3 = plt.axis('on')
p4 = plt.subplots_adjust(left=0,right=1, bottom=0, top=1)
p5 = plt.specgram(y,Fs=sr,NFFT=n_fft_val)
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
      align={'center'}
      p={8} 
      flex={1}
      >
      <SimpleGrid minChildWidth='200px' spacing={20} justify='center' width='80%'>
        <Box
          rounded={'lg'}
          boxShadow={'16px 16px 23px #a1a1a1,-16px -16px 23px #ffffff;'}
          borderRadius='50px'
          p={8}>
          { spectrogram === undefined ? 
            <Text>
              Spectrograms are a visual representation of sound, commonly used in signal processing and machine learning
              due to their ability to capture frequency, time and amplitude in a compact way. They're used in Speech recognition and synthesis, analysing the calls of animals, and for making certain kinds of music.
              <br></br><br></br>
              A spectrogram can be represented as a matrix, where each row is a frequency bin, and the columns represent a <Tooltip label='A short slice of a time series (in this case, the audio file), used for splitting the signal up for analysis'><Text as='cite'>frame. </Text></Tooltip>
              This can be plotted, and the intensity of the signal at time value and frequency can be shown by the color on the spectrogram.
              <br></br>
              A window refers to a a vector or function that weights samples within a frame, and the frame length is the umber of samples within a frame when creating the spectrogram.
              The number of samples is determined by the sampling rate - which is fixed to 22050Hz.
             
              <br></br><br></br>
              See <Link href='https://librosa.org/doc/0.7.2/glossary.html' isExternal>the Librosa Glossary <ExternalLinkIcon mx='2px' /></Link> for more context on spectrograms
              <br></br><br></br>
              <Text fontWeight={'700'}>Upload any .wav file to make a spectrogram, or use the default file to try different styles and generate the Python code to add to your projects</Text>
            </Text> :
            <Box style={{display:'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
              <Button style={{alignSelf: 'flex-start'}} colorScheme="blackAlpha" className='backButton' onClick={() => goBack()}>Restart</Button> 
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
          boxShadow={'16px 16px 23px #a1a1a1,-16px -16px 23px #ffffff;'}
          borderRadius='50px'
          p={8}>
         <Stack spacing={3} paddingBottom={5} >
              <Box>
                <Tooltip label="The length of the Fast Fourier Transform window (including zero padding). This can apply zero padding if its greater than the window length, which acts to smooth over the frequency dimension">
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
                </Tooltip>
              </Box>
              <Box>
              <Tooltip label="The window used in the FFT will be this length and zero padded to real n_fft. This can't be smaller than n_fft.">
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
                </Tooltip>
              </Box>
               <Box>
               <Tooltip label="The library used to generate the spectrogram. They have different parameters and default color configurations - your ML project may require the usage of a particular library. The code generated will differ.">
                <FormControl id="library_label">
                  <FormLabel>Library: </FormLabel>
                  <Select id="libraries" onInput={() => setDisabledElements(document.getElementById("libraries").value)}>
                    <option value="librosa">Librosa</option>
                    <option value="matplotlib">Matplotlib</option>
                  </Select>
                  </FormControl>
                  </Tooltip>
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
              <Button disabled={isSending} colorScheme="blackAlpha" onClick={() => {getSpectrogram(true)}}>Try with default sound file</Button>
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