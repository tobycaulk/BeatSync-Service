const appProvider = require('./app-provider');
require('./routes/user-route')(appProvider.getContext());

appProvider.start();