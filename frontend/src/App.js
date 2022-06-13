import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios'
import SpecContainer from './SpecContainer';


function App() {
  //const [resp, setResp] = useState();
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {axios.get('http://localhost:5000/check').then(response => {
      // setResp(response.data)
      setLoading(false)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  if (isLoading) {
    return (
      // <ThemeProvider>
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
      // </ThemeProvider>
    )
  }

  return (
    // <ThemeProvider>
    <div className="App">
      <header className="App-header">
        <div>
          Spectrogram Visualiser
        </div>
      </header>
      <div>
        <SpecContainer/>
      </div>
      
      <div>
          Explanation about spectrograms, can put what they are, links etc.
      </div>
    </div>
    // </ThemeProvider>
  );
}

export default App;
