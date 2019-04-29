import React from 'react';
import axios from "axios";
import qs from 'qs';
import logo from './logo.svg';
import './App.css';


function App() {

  const handleLoginGoogle = () => {
    /*global gapi*/
    gapi.auth.authorize({
      //immediate: false,
      response_type: 'code',
      //cookie_policy: 'single_host_origin',
      client_id: '1082660287141-vdhjt4c8qtoo2pehc57r9lb5p5nh71ko.apps.googleusercontent.com',
      scope: 'email profile openid',
      accessType: 'offline'
    }, (response) => {
      if (response && !response.error) {
        // google authentication succeed, now post data to server.
        let authResult = response;

        // delete g-oauth-window to prevent below error
        // DOMException: Blocked a frame with origin "http://localhost:3001" from accessing a cross-origin frame.
        delete authResult['g-oauth-window'];
        // axios.post('/users/auth/google_oauth2/callback', authResult)

        let instance = axios.create({
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        // Format nested params correctly
        // https://github.com/axios/axios/issues/738
        axios.interceptors.request.use(config => {
          config.paramsSerializer = params => {
            return qs.stringify(params, {
              arrayFormat: "brackets",
              encode: false
            });
          };

          return config;
        });

        instance.get(`http://localhost:1235/api/users/auth/google_oauth2/callback`, {
          params: authResult
        })
          .then(res => {
            console.log(res.data);
          }, (err) => {
            console.log("call users/auth/google_oauth2/callback failed", err);
          })
      } else {
        // google authentication failed
        console.log("google authentication failed with response", response);
      }
    });
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={handleLoginGoogle}> Login with google </button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
