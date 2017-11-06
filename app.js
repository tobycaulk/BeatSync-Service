const appProvider = require('./app-provider');
const user = require('./routes/user-route')(appProvider.getContext());

appProvider.start();