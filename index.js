const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');
const https = require('https');

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

app.get('/test', function (req, res){
  https.get('https://jyi8o8b1tb.execute-api.us-west-1.amazonaws.com/prod/api/v2/streams?hive_id=123&data_type=occupancy_raw&start=123', (resp) => {

  // The whole response has been received. Print out the result.
  console.log(response);


  }).on("error", (err) => {
    console.log("Error: " + err.message);
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