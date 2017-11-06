const user = require('.././user');

function create(req, res) {
    user
        .create(req.body.email, req.body.username, req.body.password)
        .then(user => res.send(user))
        .catch(err => res.status(400).send({
            error: err
        }));
}

function get(req, res) {
    user
        .get(req.params.id)
        .then(user =>  res.send(user))
        .catch(err => res.status(400).send({
            error: err
        }));
}

function update(req, res) {
}

function remove(req, res) {
}

module.exports = (app) => {
    app.post('/user/', (req, res) => create(req, res));
    app.get('/user/:id', (req, res) => get(req, res));
};