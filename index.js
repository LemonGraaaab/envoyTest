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
  var msg = new Array();
  for(const room of data){
    console.log(room)
    console.log(room['occupancy'])
    console.log(room['device_id'])
    msg[room['device_id']] = room['occupancy']
    console.log(room)
    console.log(msg)

  }
  console.log(msg)
  await job.attach({ label: "Room occupancy", value: JSON.stringify(data)});
  console.log(JSON.stringify(obj));

  res.send(data)
});


app.get('/demo', async (req, res) => {
  
  let auth_resp
  async function myFunction(){
      const fetch = require('node-fetch');

      const url = 'https://app.envoy.com/a/auth/v0/token';
      const options = {
        method: 'POST',
        headers: {'Accept': 'application/vnd.api+json', 'Content-Type': 'application/vnd.api+json','Authorization': 'Basic NzJiNjBkYTQtY2YxOC0xMWViLTk0MjctZTczZjc1MDMxMzZjOmIzY2RhYTg3NjcwYzRhMDJmZWZlYmVmNjcwODllN2JiMzUxMTA4ZGQ3NjU5NDI3MTU0NDE3ZDQ3MTYyZjk5ZGY1NDIyYTYzMGUyZjEwMTY0NDZhOTZlN2YwMmEwY2RlYWQyNmU4Y2VkODE5YTZlN2I1NzE3MzIzNzhiNWUyNmVl'},
        body: '{"grant_type":"password","scope":"companies.read,spaces.read,reservations.read,reservations.write,locations.read,employees.read","password":"C0rbuC0rbu","username":"admin@butlr.tech"}'
      };
      
      let auth_res;
      auth_res = await fetch(url, options)
        .then(res => res.json());
      return auth_res
      // do whatever you need with vm.feed below
   }
  auth_resp = await myFunction()
  console.log(auth_resp);
  auth_token = auth_resp.access_token
  console.log(auth_token);

const fetch = require('node-fetch');
  const url = 'https://api.envoy.com/rest/v1/reservations';
  const options = {
    method: 'POST',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({
      reservation: {
        locationId: '128566',
        spaceType: 'DESK',
        userEmail: 'donglong199312@gmail.com',
        startTime: '2021-08-24T14:15:22Z',
        endTime: '2021-08-24T14:15:22Z'
      }
    })
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));


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