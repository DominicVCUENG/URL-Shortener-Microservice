require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase = {};

app.post('/api/shorturl', (req, res) => {
    const originalUrl = req.body.url;
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    
    if (!urlRegex.test(originalUrl)) {
        return res.json({ error: 'invalid url' });
    }

    const shortUrl = shortid.generate();
    urlDatabase[shortUrl] = originalUrl;

    res.json({
        original_url: originalUrl,
        short_url: shortUrl
    });
});

app.get('/api/shorturl/:shortid', (req, res) => {
    const shortid = req.params.shortid;
    const originalUrl = urlDatabase[shortid];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.json({ error: 'No short URL found for the given input' });
    }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
