/**
* Prototype Google Data Loss Prevention API - v2Beta1
* Authentication Using service account key file
 */

var express = require('express');
var googleAuth = require('google-auto-auth');
var rp = require('request-promise');
var bodyParser = require('body-parser');
const path = require('path');
const util = require('util');
//Load gcloud client and Set Project ID and Path to Key file for server to server comms
const auth = require('google-auto-auth')({
  keyFilename: 'yourkey.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//URL for Data Loss Prevention API
const API_URL = 'https://dlp.googleapis.com/v2beta1';

/* Routes  */
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.post('/inspect',function(req, res){
 var data = req.body.text;

 auth.getToken((err, token) => {
   if (err) {
     console.err('Error fetching auth token:', err);
     process.exit(1);
   }
   // Construct items to inspect
     const items = [{ type: 'text/plain', value: `${data}` }];
     //Construct REST request body
       const requestBody = {
            inspectConfig: {"infoTypes": [],"minLikelihood": "LIKELIHOOD_UNSPECIFIED","maxFindings": 5,"includeQuote": true },
            items: items
            };

     // Construct REST request Options
           const options = {
             url: `${API_URL}/content:inspect`,
             headers: {'Authorization': `Bearer ${token}`,'Content-Type': 'application/json'},
             json: requestBody
             };

           // Run REST request
           rp.post(options)
             .then((body) => {
               const results = body.results[0];
               res.send(JSON.stringify(results, null, 2));
             })
             .catch((err) => { console.log('Error in inspectString:', err); });
           // [END inspect_string]
 });

});

app.listen(3000, function () {
    console.log('Google Data Loss Protection API WebApp running on port 3000!');
});
