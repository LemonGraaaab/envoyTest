const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');
const https = require('https');
const axios = require('axios')


const app = express();
app.use(middleware());


async function envoyAuth(){
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

function getStartTime(baseTime){
  var seconds = 2;
  var newDate = new Date(baseTime.getTime() + (1000 * seconds))
  return newDate
}

function getEndTime(startTime){
  var seconds = 100;
  var newDate = new Date(startTime.getTime() + (1000 * seconds))
  return newDate
}


function createReservation(locationId,auth,dict) {
  const fetch = require('node-fetch');

  const url = 'https://api.envoy.com/rest/v1/reservations';
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  startTime = getStartTime(tomorrow);


  if(startTime<dict['00-17-0d-00-00-70-ce-3e']){
    console.log("Trying to create reservation for device 00-17-0d-00-00-70-ce-3e but it already have an existing one now, skip reservation creation now.")
    return null;
  }
  endTime = getEndTime(startTime);
  const options = {
    method: 'POST',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json','Authorization': auth},
    body: JSON.stringify({
      reservation: {
        locationId: '128566',
        spaceType: 'DESK',
        userEmail: 'donglong199312@gmail.com',
        startTime: startTime,
        endTime: endTime
      }
    })
  };


  return fetch(url, options)
    .then(res => res.json())
    // .then(json => console.log(json))
    .catch(err => console.error('error:' + err));
}


function cancelReservation(reservationId,auth) {
  const fetch = require('node-fetch');

  const url = 'https://api.envoy.com/rest/v1/reservations/'  +reservationId+ '/cancel';
  const options = {method: 'POST',    headers: {Accept: 'application/json', 'Content-Type': 'application/json','Authorization': auth},
};

  return fetch(url, options)
    .then(res => res.json())
    .catch(err => console.error('error:' + err));
}


function getToken() {
  const promise =  axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBvjUMP-pEGcl_0VEc-Ptc6lJTrs5M-VV8', {
    email: 'donglong199312@gmail.com',
    password: 'longdong',
    returnSecureToken: true
  });

  const dataPromise = promise.then((response) => response.data.idToken)
  return dataPromise
}

function queryOccupany(tokenStr){
  // create a promise for the axios request
  const promise = axios.get("https://jyi8o8b1tb.execute-api.us-west-1.amazonaws.com/prod/api/v2/streams?hive_id=30_11&data_type=occupancy_raw&database=idpsante",{ headers: {"Authorization" : `Bearer ${tokenStr}`} })


    // using .then, create a new promise which extracts the data
  const dataPromise = promise.then((response) => response.data)

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

app.get('/checkAllOccupancy', async (req, res) =>{
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
  auth_resp = await envoyAuth()
  auth_token = auth_resp.access_token

  auth = 'Bearer '+ auth_token

  console.log("Start pulling Occupany Data...");
  var dict = {};
  i = 0;
  pull_time = 10;
  while(pull_time > 0){
    pull_time--;
    console.log("Checking Occupany...");
    const token = await getToken();
    const data = await queryOccupany(token);
    console.log("Fetching data from Butlr...");
    for(const room of data){
      // console.log(room)
      // console.log(i)

      // Change to actual occupany data once we have control over them
      // occupancy = Number(room['occupancy']);
      occupancy = 0;
      if(i==0){
        occupancy = 1
      }
      console.log("Butlr Device "+room['device_id'] + " has occupany "+occupancy);
      if(occupancy  > 0){
        console.log("Create reservation automatically for space with device "+room['device_id'] + " since it is currently not empty...");
        // Always create under location 128566
        reserve_resp = await createReservation('128566',auth,dict)
        if(reserve_resp!=null){
          console.log(reserve_resp['data']['endTime']);
          dict[room['device_id']] = Date.parse(reserve_resp['data']['endTime'])
          console.log(dict);

          console.log("successfully created reservation with response "+JSON.stringify(reserve_resp));  
        }      
      }else{
        console.log("No occupany detected, No pending reservation, continue pulling....");  
      }
      await new Promise(resolve => setTimeout(resolve, 4000));
      i = i+1;
    }
  }

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


app.get('/democancel', async (req, res) => {
  
  let auth_resp
  auth_resp = await envoyAuth()
  auth_token = auth_resp.access_token

  auth = 'Bearer '+ auth_token

  console.log("Start pulling Occupany Data...");
  var dict = {};
  pull_time = 10;
  while(pull_time > 0){

    pull_time = pull_time-1;
    // console.log("Checking Occupany...");
    const token = await getToken();
    const data = await queryOccupany(token);
    // console.log("Fetching data from Butlr...");
    i = 0;
    for(const room of data){
      // console.log(room)
      // console.log(i)

      // Change to actual occupany data once we have control over them
      // occupancy = Number(room['occupancy']);
      occupancy = 0;
      // if(i%2==1){
      //   occupancy = 0
      // }
      console.log("Butlr Device "+room['device_id'] + " has occupany "+occupancy);
      if(occupancy  > 0){
        console.log("Create reservation automatically for space with device "+room['device_id'] + " since it is currently empty...");
        // Always create under location 128566
        reserve_resp = await createReservation('128566')
        if(reserve_resp!=null){
          console.log(reserve_resp['data']['endTime']);
          dict[room['device_id']] = Date.parse(reserve_resp['data']['endTime'])
          console.log(dict);

          console.log("successfully created reservation with response "+JSON.stringify(reserve_resp));  
        }      
      }else{
        console.log(pull_time)
        if(pull_time == 9){
          console.log("No occupany detected,has pending reservation, CANCEL it");
          cancel_resp = await cancelReservation('d-508579',auth);
        }else{
          console.log("No occupany detected,no pending reservation, continue pulling....");
        }
      }
      await new Promise(resolve => setTimeout(resolve, 6000));
      i++;
    }
  }

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

app.use(errorMiddleware());

const listener = app.listen(process.env.PORT || 0, () => {
  console.log(`Listening on port ${listener.address().port}`);
});