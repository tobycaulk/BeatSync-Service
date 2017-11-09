const bandSession = require('.././band-session');

function create(req, res) {
    bandSession
        .create(req.body.trackQueue, req.body.userIds, req.body.bandId)
        .then(session => res.send(session))
        .catch(err => res.status(400).send({
            error: err
        }));
}

function get(req, res) {
    bandSession
        .get(req.params.id)
        .then(session => res.send(session))
        .catch(err => res.status(400).send({
            error: err
        }));
}

function update(req, res) {}
function remove(req, res) {}

module.exports = function(app) {
    app.post('/band/session/', (req, res) => create(req, res));
    app.get('/band/session/:id', (req, res) => get(req, res));
    app.patch('/band/session/:id', (req, re) => update(req, res));
    app.delete('/band/session/:id', (req, res) => remove(req, res));
};