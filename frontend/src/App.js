//import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
// import { Logo } from './Logo';
import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios'
import SpecContainer from './SpecContainer';
import CallToActionWithAnnotation from './Header';


// function App() {
//   return (
//     <ChakraProvider theme={theme}>
//       <Box textAlign="center" fontSize="xl">
//         <Grid minH="100vh" p={3}>
//           <ColorModeSwitcher justifySelf="flex-end" />
//           <VStack spacing={8}>
//             <Logo h="40vmin" pointerEvents="none" />
//             <Text>
//               Edit <Code fontSize="xl">src/App.js</Code> and save to reload.
//             </Text>
//             <Link
//               color="teal.500"
//               href="https://chakra-ui.com"
//               fontSize="2xl"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Learn Chakra
//             </Link>
//           </VStack>
//         </Grid>
//       </Box>
//     </ChakraProvider>
//   );
// }

function App() {
  //const [resp, setResp] = useState();
  const [isLoading, setLoading] = useState(true);
  const myRef = useRef(null);

 function executeScroll() {
    myRef.current.scrollIntoView();
  }     


  useEffect(() => {axios.get('http://localhost:5000/check').then(response => {
      // setResp(response.data)
      setLoading(false)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  if (isLoading) {
    return (
      <ChakraProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            Spectrogram Visualiser
            <h2>
              Loading....
            </h2>
          </div>
        </header>
      </div>
      </ChakraProvider>
    )
  }

  return (
    <ChakraProvider theme={theme}>
    <div className="App">
      {/* <header className="App-header">
        <div>
          Spectrogram Visualiser
        </div>
      </header> */}
      <CallToActionWithAnnotation ctaLink={executeScroll}/>
      <div ref={myRef}>
        <SpecContainer/>
      </div>
      
      <div>
          Explanation about spectrograms, can put what they are, links etc.
      </div>
    </div>
    </ChakraProvider>
  );
}

export default App;
