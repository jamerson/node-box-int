var passport = require('passport'),
    BoxStrategy = require('passport-box').Strategy,
    box_sdk = require('box-sdk'),
    fs = require("fs"),
    cfenv = require("cfenv");

var vcapLocal = null;
try {
    vcapLocal = require("./vcap-local.json");
}
catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {};
var appEnv = cfenv.getAppEnv(appEnvOpts);

var boxCreds = appEnv.getServiceCreds("box"),
    box = box_sdk.Box();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

console.log(boxCreds.clientId, boxCreds.clientSecret)

passport.use(new BoxStrategy({
    clientID: boxCreds.clientId || boxCreds.client_id,
    clientSecret: boxCreds.clientSecret || boxCreds.client_secret,
    callbackURL: config.appURL(appEnv.port) + "/auth/box/callback"
}, box.authenticate()));