const bcrypt = require('bcrypt-nodejs');

function hash(plain) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plain, null, null, (err, hash) => {
            if(err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

function hashSync(plain) {
    return bcrypt.hashSync(plain);
}

function check(hashed, plain) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plain, hashed, (err, res) => {
            if(err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

module.exports = {
    hash: hash,
    hashSync: hashSync,
    check: check
};