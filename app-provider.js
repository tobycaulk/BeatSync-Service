const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const context = express();
context.use(bodyParser.json());

module.exports = {
    start: () => {
        context.listen(config.server.port);
    },
    getContext: () => {
        return context;
    }
};