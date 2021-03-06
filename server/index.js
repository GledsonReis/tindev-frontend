const express = require("express");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");
const pino = require('express-pino-logger')();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/authenticate", (req, res) => {
  const { client_id, redirect_uri, client_secret, code } = req.body;

  const data = new FormData();
  data.append("client_id", client_id);
  data.append("client_secret", client_secret);
  data.append("code", code);
  data.append("redirect_uri", redirect_uri);

  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data
  })
    .then(response => response.text())
    .then(paramsString => {
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");
      const scope = params.get("scope");
      const token_type = params.get("token_type");

      // Request to return data of a user that has been authenticated
      return fetch(
        `https://api.github.com/user?scope=${scope}&token_type=${token_type}`,
        {
          headers: { "Authorization": `token ${access_token}` }
        }
      );
    })
    .then(response => response.json())
    .then(response => {
      return res.status(200).json(response);
    })
    .catch(error => {
      return res.status(400).json(error);
    });
});

app.post("/register", (req, res) => {
  const { user } = req.body;

  const newUser = { 'user': user };

  // Request to exchange code for an access token
  fetch(`http://localhost:5000/api/signup`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(newUser)
  })
    .then(response => response.json())
    .then(response => {
      if (response.status == 422) {
        return res.status(422).json(response);
      } else {
        return res.status(200).json(response);
      }
    })
    .catch(error => {
      return res.status(400).json(error);
    });
});

const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));