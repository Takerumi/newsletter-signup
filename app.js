const express = require('express'),
  request = require('request'),
  app = express(),
  https = require('https'),
  port = 3000

require('dotenv').config()

const API_KEY = process.env.API_KEY
const LIST_ID = process.env.LIST_ID

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/signup.html`)
})

app.post('/', (req, res) => {
  const firstName = req.body.firstName,
    lastName = req.body.lastName,
    email = req.body.email

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  }

  const jsonData = JSON.stringify(data)

  const url = `https://us11.api.mailchimp.com/3.0/lists/${LIST_ID}`,
    options = {
      method: 'POST',
      auth: `takerumi:${API_KEY}`,
    }

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`)
    } else {
      res.sendFile(`${__dirname}/failure.html`)
    }
  })

  request.write(jsonData)
  request.end()
})

app.post('/failure', (req, res) => {
  res.redirect('/')
})

app.listen(port, () => console.log(`Server is running on ${port}`))
