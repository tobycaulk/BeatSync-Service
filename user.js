const mongoProvider = require('./mongo-provider');
const passwordProvider = require('./password-provider');
const config = require('./config');
const errorCodes = require('./error-codes');

let collection = config.mongo.collections.user;

function scrubUser(user) {
    delete user.hashedPassword;
    return user;
}

function checkIfUsernameIsTaken(username) {
    return new Promise((resolve, reject) => {
        mongoProvider
            .find(collection, {
                username: username
            })
            .then(user => {
                resolve(user.length > 0);
            })
            .catch(err => reject(err));
    });
}

function getHashedPassword(password) {
    return passwordProvider.hash(password);
}

function insertUser(email, username, hashedPassword) {
    return mongoProvider.insert(collection, {
        email: email,
        username: username,
        hashedPassword: hashedPassword,
        createDate: Date.now(),
        updateDate: Date.now()
    })
}

function create(email, username, password) {
    return new Promise((resolve, reject) => {
        Promise.all([checkIfUsernameIsTaken(username), getHashedPassword(password)]) 
        .then(data => {
            if(data[0]) {
                reject(errorCodes.user.username.taken);
            } else {
                insertUser(email, username, data[1])
                    .then(user => resolve(scrubUser(user)))
                    .catch(err => {
                        console.log("Error while inserting user into DB [" + err + "]");
                        reject(errorCodes.generic);
                    });
            }
        })
        .catch(err => {
            console.log("Error while creating user [" + err + "]");
            reject(errorCodes.generic);
        });
    });
}

function get(id) {
    return new Promise((resolve, reject) => {
        mongoProvider
            .findOne(collection, {
                _id: new mongoProvider.objectId(id)
            })
            .then(user => {
                if(user === undefined) {
                    reject(errorCodes.user.notFound);
                } else {
                    resolve(user);
                }
            })
            .catch(err => {
                console.log("error while getting user with id[" + id + "]. Error [" + err + "]");
                reject(errorCodes.generic);
            });
    });
}

function update() {}
function remove() {}

module.exports = {
    create: create,
    get: get,
    update: update,
    remove: remove
};