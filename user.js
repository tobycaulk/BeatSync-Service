const S = require('string');
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
        Promise
            .all([checkIfUsernameIsTaken(username), getHashedPassword(password)]) 
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
                _id: mongoProvider.objectId(id)
            })
            .then(user => {
                if(user === undefined) {
                    reject(errorCodes.notFound);
                } else {
                    resolve(scrubUser(user));
                }
            })
            .catch(err => {
                console.log("Error while getting user with id[" + id + "]. Error [" + err + "]");
                reject(errorCodes.generic);
            });
    });
}

function getUpdateableFieldContainer(name, value) {
    return {
        name: name,
        value: value
    }
}

function getUpdateFields(fields) {
    let update = {};
    fields.forEach((field) => {
        if(!S(field.value).isEmpty()) {
            update[field.name] = field.value;
        }
    });

    return update;
}

function update(id, email, username, password) {
    return new Promise((resolve, reject) => {
        let update = getUpdateFields([
            getUpdateableFieldContainer("email", email), 
            getUpdateableFieldContainer("username", username), 
            getUpdateableFieldContainer("hashedPassword", passwordProvider.hashSync(password))]);

        mongoProvider
            .update(collection, {
                _id: mongoProvider.objectId(id)
            }, update)
            .then(success => {
                get(id)
                    .then(user => resolve(user))
                    .catch(err => {
                        console.log("Error while getting user after update with id[" + id + "]. Error [" + err + "]");
                        reject(errorCodes.generic);
                    });
            })
            .catch(err => {
                console.log("Error while updating user with id[" + id + "]. Error [" + err + "]");
                reject(errorCodes.generic);
            });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        mongoProvider
            .remove(collection, {
                _id: mongoProvider.objectId(id)
            })
            .then(success => resolve({ success: true }))
            .catch(err => {
                console.log("Error while removing user with id[" + id + "]. Error [" + err + "]");
                reject(errorCodes.generic);
            });
    });
}

module.exports = {
    create: create,
    get: get,
    update: update,
    remove: remove
};