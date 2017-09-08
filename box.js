var passport = require('passport'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    BoxStrategy = require('passport-box').Strategy,
    box_sdk = require('box-sdk'),
    fs = require("fs"),
    watson = require('watson-developer-cloud'),
    _ = require("underscore"),
    uuid = require("node-uuid"),
    cfenv = require("cfenv");

var vcapLocal = null;
try {
    vcapLocal = require("./vcap-local.json");
}
catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {};
var appEnv = cfenv.getAppEnv(appEnvOpts);

var boxCreds = getServiceCreds(appEnv, "box"),
    box = box_sdk.Box();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new BoxStrategy({
    clientID: boxCreds.clientId || boxCreds.client_id,
    clientSecret: boxCreds.clientSecret || boxCreds.client_secret,
    callbackURL: config.appURL(appEnv.port) + "/auth/box/callback"
}, box.authenticate()));