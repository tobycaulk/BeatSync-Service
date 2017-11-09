const appProvider = require('./app-provider');
require('./routes/user-route')(appProvider.getContext());
require('./routes/band-session-route')(appProvider.getContext());

appProvider.start();