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
        .then(user => res.send(user))
        .catch(err => res.status(400).send({
            error: err
        }));
}

function update(req, res) {
    user
        .update(req.params.id, req.body.email, req.body.username, req.body.password)
        .then(user => res.send(user))
        .catch(err => res.status(400).send({
            error: err
        }));
}

function remove(req, res) {
    user
        .remove(req.params.id)
        .then(user => res.send(user))
        .catch(err => res.status(400).send({
            error: err
        }));
}

module.exports = (app) => {
    app.post('/user/', (req, res) => create(req, res));
    app.get('/user/:id', (req, res) => get(req, res));
    app.patch('/user/:id', (req, res) => update(req, res));
    app.delete('/user/:id', (req, res) => remove(req, res));
};