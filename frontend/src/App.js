import {
  ChakraProvider,
  Box,
  Text,
  Heading,
  Link,
  theme,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import axios from 'axios'
import SpecContainer from './SpecContainer';
import { ExternalLinkIcon } from '@chakra-ui/icons'

export default function App() {
  const [isLoading, setLoading] = useState(true);

  // var host = '0.0.0.0';
  // if (process.env.PORT === undefined) {
  //   console.log("got here")
  //   host = "http://localhost"
  // }
  //const port = process.env.PORT || 5000;

  useEffect(() => {axios.get('/check').then(() => {
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
      <Box bg='#f2f2f2' minHeight={'100vh'}>
        <Box>
          <Heading
            paddingTop={10  }
            align={"center"}
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
                Spectrogram 
            <Text as={'span'} color={'blue.400'}>
              Visualiser
            </Text>
          </Heading>
          <Heading 
            p={2}
            align={"center"}           
            fontWeight={300}
            fontSize={{ base: '2xl', sm: '3xl', md: '3xl' }}
            lineHeight={'100%'}
            paddingBottom={20}>
              Rapidly prototype with modern Python libraries
          </Heading>

          <Box>
            <SpecContainer/>
          </Box>

          <Box position={"fixed"} p={2} bottom='5' right='5' bg='blackAlpha.800' textColor={'white'} rounded={'lg'}>
            <Link href='https://github.com/Senste/SpecVis'>Github repo <ExternalLinkIcon></ExternalLinkIcon></Link>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

