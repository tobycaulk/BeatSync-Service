module.exports = {
    none: 0,
    generic: 1,
    notFound: 2,
    user: {
        username: {
            taken: 110,
            empty: 111
        },
        password: {
            empty: 120,
            lessThanMinLength: 121
        }
    },
    bandSession: {
        trackQueueEmpty: 200,
        userIdListEmpty: 201
    }
};