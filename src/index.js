const express = require("express");
const shopify = require("@shopify/shopify-api");
const axios = require("axios");
require('dotenv').config();


const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;
const app = express();
const embedded = true;

shopify.default.Context.initialize({
    API_KEY,
    API_SECRET_KEY,
    SCOPES: SCOPES.split(","),
    HOST_NAME: HOST.replace(/https:\/\//, ""),
    IS_EMBEDDED_APP: embedded,
    API_VERSION: shopify.ApiVersion.October20,
    SESSION_STORAGE: new shopify.default.Session.MemorySessionStorage(),
});

app.get('/', async (req, res) => {
    return res.send('Ok.')
});

app.get('/login', async (req, res) => {
    var authRoute = await shopify.default.Auth.beginAuth(req, res, SHOP, '/auth/callback', true);
    return res.redirect(authRoute);
})

app.get('/auth/callback', async (req, res) => {
    const { code, hmac, host, shop } = req.query
    tokenUrl = `https://${shop}/admin/oauth/access_token`;
    try {
        axios.post(tokenUrl, { client_id: API_KEY, client_secret: API_SECRET_KEY, code: code})
        .then((response) => {
            const { access_token } = response.data
            console.log(access_token)
        });
    } catch {
        return res.send("Error")
    }
    return res.redirect('/');
});


app.listen(3000, () => {
    console.log('your app is now listening on port 3000');
});