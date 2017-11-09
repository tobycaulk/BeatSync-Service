const bandSession = require('.././band-session');

function create(req, res) {}
function get(req, res) {}
function update(req, res) {}
function remove(req, res) {}

module.exports = function(app) {
    app.post('/band/', (req, res) => create(req, res));
    app.get('/band/:id', (req, res) => get(req, res));
    app.patch('/band/:id', (req, re) => update(req, res));
    app.delete('/band/:id', (req, res) => remove(req, res));
};