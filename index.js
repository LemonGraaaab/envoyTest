const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');
const https = require('https');
const axios = require('axios')


const app = express();

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
  let tokenStr = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjNGQwMGJjM2NiZWE4YjU0NTMzMWQxZjFjOTZmZDRlNjdjNTFlODkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiRG9uZyIsInJvbGVzIjpbInN1cGVydXNlciJdLCJjbGllbnRfaWQiOiJjbGllbnRfMXJHanpidE43bXhSVmlaMXJwbUk2WVpvcVo2IiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2J1dGxyLWNsaWVudCIsImF1ZCI6ImJ1dGxyLWNsaWVudCIsImF1dGhfdGltZSI6MTYyNDA3NTIzOSwidXNlcl9pZCI6InVzZXJfMGQyOGM2M2FhMzU1M2MwNDE2ZTMzNzYzMGI3MzZmODcyOGQ1MmQwYiIsInN1YiI6InVzZXJfMGQyOGM2M2FhMzU1M2MwNDE2ZTMzNzYzMGI3MzZmODcyOGQ1MmQwYiIsImlhdCI6MTYyNDA3NTIzOSwiZXhwIjoxNjI0MDc4ODM5LCJlbWFpbCI6ImRvbmdsb25nMTk5MzEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRvbmdsb25nMTk5MzEyQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.mawIoMaNheVKOJi43-ZssMGrRq7fJo-NBT1UXGA12OcsrXxLjTgthakEHXL60b38sx9eWQer1Lp3qNfOf7ZpAYw0hznunDki5SNh9vJb-YTgE75HTkMDlPC09iunxTSFulXYZ30tlN57w00_2ezTXtdyTVMT0oRtOSV4qXHmZmnK5yjy7ozpBvEzIp4Io6ckcWgM4XazB8Kv0EIp5sBVhc6IyVLZxHzOKxJ7sE00Wwyg3vt09sTA4E9KUEmxRNTtGEYHSAMDmqA_IK16kfgp4SJiDAI_CEil2HZJZiwItT39JfFv9d9DMoSvtFQru3STm7LrFgm0N5M5M-V60JQqVQ';

  axios.get("https://jyi8o8b1tb.execute-api.us-west-1.amazonaws.com/prod/api/v2/streams?hive_id=1234&data_type=occupancy_raw&start=123",{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
       .then(response => res.json(response.data))
       .catch(err => res.send(err));
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