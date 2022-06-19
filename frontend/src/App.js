//import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  theme,
} from '@chakra-ui/react';
import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios'
import SpecContainer from './SpecContainer';
import CallToActionWithAnnotation from './CTA';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const myRef = useRef(null);

 function executeScroll() {
    myRef.current.scrollIntoView();
  }     


  useEffect(() => {axios.get('http://localhost:5000/check').then(() => {
      setLoading(false)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  if (isLoading) {
    return (
      <ChakraProvider theme={theme}>
      <Box>
        <Heading justify={'center'} align={"center"}>
          <Box>
            Spectrogram Visualiser
            <Text justify={'center'} align={"center"} p={100}>
              Loading....
            </Text>
          </Box>
        </Heading>
      </Box>
      </ChakraProvider>
    )
  }

  return (
    <ChakraProvider theme={theme}>
    <Box>
      <CallToActionWithAnnotation ctaLink={executeScroll}/>

      <Box>
        <SpecContainer/>
      </Box>
      <div ref={myRef}></div>
      
      <Box align={'center'}>
          Explanation about spectrograms, can put what they are, links etc.
      </Box>
    </Box>
    </ChakraProvider>
  );
}

