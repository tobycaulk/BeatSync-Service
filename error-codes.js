module.exports = {
    none: 0,
    generic: 1,
    user: {
        notFound: 100,
        username: {
            taken: 110,
            empty: 111
        },
        password: {
            empty: 120,
            lessThanMinLength: 121
        }
    }
};