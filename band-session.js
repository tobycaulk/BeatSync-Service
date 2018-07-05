const mongoProvider = require('./mongo-provider');
const config = require('./config');
const errorCodes = require('./error-codes');
const band = require('./band');
const updateFieldHandler = require('./update-field-handler');

const collection = config.mongo.collections.bandSession;

function getCurrentBandSession(bandId) {
    return mongoProvider.findOne(collection, {
        bandId: bandId
    });
}

function insertBandSession(trackQueue, userIds, bandId) {
    let currentTrackId = trackQueue[0];
    let currentTrackTime = 0;

    return mongoProvider.insert(collection, {
        trackQueue: trackQueue,
        currentTrack: currentTrackId,
        currentTrackTime: currentTrackTime,
        userIds: userIds,
        bandId: bandId,
        createDate: Date.now(),
        updateDate: Date.now()
    })
}

function create(trackQueue, userIds, bandId) {
    return new Promise((resolve, reject) => {
        getCurrentBandSession(bandId)
            .then(current => {
                if(trackQueue === undefined || trackQueue.length == 0) {
                    reject(errorCodes.bandSession.trackQueueEmpty);
                } else if(userIds === undefined || userIds.length == 0) {
                    reject(errorCodes.bandSession.userIdListEmpty);
                } else {
                    insertBandSession(trackQueue, userIds, bandId)
                        .then(doc => resolve(doc))
                        .catch(err => {
                            console.log("Error while creating band session for bandId[" + bandId + "]. Error [" + err + "]");
                            reject(errorCodes.generic);
                        });
                }
            })
            .catch(err => {
                console.log("Error while getting current band session for bandId[" + bandId + "]. Error [" + err + "]");
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
            .then(session => {
                if(session === undefined) {
                    reject(errorCodes.notFound);
                } else {
                    resolve(session);
                }
            })
            .catch(err => {
                console.log("Error while retrieving band session with id[" + id + "]. Error [" + err + "]");
                reject(errorCodes.generic);
            });
    });
}

function update(session) {
    return new Promise((resolve, reject) => {
        let update = updateFieldHandler.getUpdateFields([
            updateFieldHandler.getUpdateableFieldContainer("currentTrack", session.currentTrack),
            updateFieldHandler.getUpdateableFieldContainer("currentTrackTime", session.currentTrackTime),
            updateFieldHandler.getUpdateableFieldContainer("userIds", session.userIds)
        ]);
        console.log(update);
        mongoProvider
            .update(collection, {
                _id: mongoProvider.objectId(session.id)
            }, update)
            .then(success => resolve({ success: true }))
            .catch(err => {
                console.log("Error while updating band session with id[" + session.id + "]. Error [" + err + "]");
                reject(errorCodes.generic);
            });
    });
}

module.exports = {
    create: create,
    get: get,
    update: update,
    remove: null
};