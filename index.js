const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');
const https = require('https');
const axios = require('axios')


const app = express();
app.use(middleware());


function refresh() { 
  
}

function getToken() {
  console.log("TOKEN");
  const promise =  axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBvjUMP-pEGcl_0VEc-Ptc6lJTrs5M-VV8', {
    email: 'donglong199312@gmail.com',
    password: 'longdong',
    returnSecureToken: true
  });

  const dataPromise = promise.then((response) => response.data.idToken)
  return dataPromise
}

function queryOccupany(tokenStr){
  console.log("QUERY");
  // create a promise for the axios request
  const promise = axios.get("https://jyi8o8b1tb.execute-api.us-west-1.amazonaws.com/prod/api/v2/streams?hive_id=30_11&data_type=occupancy_raw&database=idpsante&room_tag=office",{ headers: {"Authorization" : `Bearer ${tokenStr}`} })

  console.log("QUERY1");

    // using .then, create a new promise which extracts the data
  const dataPromise = promise.then((response) => response.data)
  console.log("QUERY2");

    // return it
  return dataPromise
}

app.get('/hello-options', (req, res) => {
  res.send([
    {
      label: 'Hello',
      value: 'Hello',
    },
    {
      label: 'Hola',
      value: 'Hola',
    },
    {
      label: 'Aloha',
      value: 'Aloha',
    },
  ]);
});

app.post('/checkAllOccupancy', async (req, res) =>{
  const token = await getToken();
  console.log(token);
  const data = await queryOccupany(token)
  const envoy = req.envoy; // our middleware adds an "envoy" object to req.
  console.log(envoy);

  const job = envoy.job;
  var arr = new Array();
  for(const room of data){
    console.log(room)
    console.log(room['occupancy'])
    console.log(room['device_id'])
  }
  await job.attach({ label: 'Hello', value: data });
  console.log(data);

  res.send(data)
});

app.post('/entry-sign-in', async (req, res) => {
  const envoy = req.envoy; // our middleware adds an "envoy" object to req.

  const job = envoy.job;
  const hello = envoy.meta.config.HELLO;
  const visitor = envoy.payload;
  const visitorName = visitor.attributes['full-name'];
  
  const message = `${hello} ${visitorName}!`; // our custom greeting
  await job.attach({ label: 'Hello', value: message }); // show in the Envoy dashboard.
  
  res.send({ hello });
});

app.use(errorMiddleware());

const listener = app.listen(process.env.PORT || 0, () => {
  console.log(`Listening on port ${listener.address().port}`);
});