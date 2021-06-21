const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');
const https = require('https');
const axios = require('axios')


const app = express();

function refresh() { 
    console.log("REFRESHHHHHH");
}

function queryOccupany(tokenStr){
  console.log("QUERY");
  // create a promise for the axios request
  const promise = axios.get("https://jyi8o8b1tb.execute-api.us-west-1.amazonaws.com/prod/api/v2/streams?hive_id=123&data_type=occupancy_raw&start=123&database=eval",{ headers: {"Authorization" : `Bearer ${tokenStr}`} })

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

app.get('/test', async (req, res) =>{
  let tokenStr = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4ZGYxMzgwM2I3NDM2NjExYWQ0ODE0NmE4ZGExYjA3MTg2ZmQxZTkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiRG9uZyIsInJvbGVzIjpbInN1cGVydXNlciJdLCJjbGllbnRfaWQiOiJjbGllbnRfMXJHanpidE43bXhSVmlaMXJwbUk2WVpvcVo2IiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2J1dGxyLWNsaWVudCIsImF1ZCI6ImJ1dGxyLWNsaWVudCIsImF1dGhfdGltZSI6MTYyNDI0OTAzNiwidXNlcl9pZCI6InVzZXJfMGQyOGM2M2FhMzU1M2MwNDE2ZTMzNzYzMGI3MzZmODcyOGQ1MmQwYiIsInN1YiI6InVzZXJfMGQyOGM2M2FhMzU1M2MwNDE2ZTMzNzYzMGI3MzZmODcyOGQ1MmQwYiIsImlhdCI6MTYyNDI0OTAzNiwiZXhwIjoxNjI0MjUyNjM2LCJlbWFpbCI6ImRvbmdsb25nMTk5MzEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRvbmdsb25nMTk5MzEyQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kVIrHuCjxCE_gzlBUrYlcHmw02S-7ICnhYGZ0HefcsQWa-K8mKED4eJ39_1e7GfURkgSpdcvYwXUVZfDqH0mSzZ_Y81xm3F_0hUGG0A6VYur7EP_8euLrg0h-7v269Iq-A5WFHtU0a-2NCTiJa_-y8D0NE5egQsOZEQng71iCcnTcyXHzsrZDtwGK0o_-tK-C44cRPDEUVd3obUjxOjNN4MC0MwuARfHVg4Do-vwJRbESYFMJG0-SMc5WsrUPqJEZ7S4WDiMXcL7e5WjrKtJ0Yt7JIyrtDfX1GXiqo73d-vMXux6EbDKDn2mwJXPgRWr08KX18ey-elMT3ITgoCssA.eyJuYW1lIjoiRG9uZyIsInJvbGVzIjpbInN1cGVydXNlciJdLCJjbGllbnRfaWQiOiJjbGllbnRfMXJHanpidE43bXhSVmlaMXJwbUk2WVpvcVo2IiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2J1dGxyLWNsaWVudCIsImF1ZCI6ImJ1dGxyLWNsaWVudCIsImF1dGhfdGltZSI6MTYyNDA3NTIzOSwidXNlcl9pZCI6InVzZXJfMGQyOGM2M2FhMzU1M2MwNDE2ZTMzNzYzMGI3MzZmODcyOGQ1MmQwYiIsInN1YiI6InVzZXJfMGQyOGM2M2FhMzU1M2MwNDE2ZTMzNzYzMGI3MzZmODcyOGQ1MmQwYiIsImlhdCI6MTYyNDA3NTIzOSwiZXhwIjoxNjI0MDc4ODM5LCJlbWFpbCI6ImRvbmdsb25nMTk5MzEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRvbmdsb25nMTk5MzEyQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.mawIoMaNheVKOJi43-ZssMGrRq7fJo-NBT1UXGA12OcsrXxLjTgthakEHXL60b38sx9eWQer1Lp3qNfOf7ZpAYw0hznunDki5SNh9vJb-YTgE75HTkMDlPC09iunxTSFulXYZ30tlN57w00_2ezTXtdyTVMT0oRtOSV4qXHmZmnK5yjy7ozpBvEzIp4Io6ckcWgM4XazB8Kv0EIp5sBVhc6IyVLZxHzOKxJ7sE00Wwyg3vt09sTA4E9KUEmxRNTtGEYHSAMDmqA_IK16kfgp4SJiDAI_CEil2HZJZiwItT39JfFv9d9DMoSvtFQru3STm7LrFgm0N5M5M-V60JQqVQ';
  queryOccupany(tokenStr)
    .then(data => res.json(response.data))
    .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("HERE");
      if(error.response){
        console.log(error.response.status);
        if(error.response.status === 401){
          refresh()
        }
        res.json(error.response)
      }      
    }
  });
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