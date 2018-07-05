const S = require('string');

function isArray(field) {
    return Array.isArray(field);
}

function isString(field) {
    return typeof field === 'string' && S(field.value).isEmpty();
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
        if(field !== undefined && (isArray(field) || isString(field))) {
            update[field.name] = field.value;
        }
    });

    return update;
}

module.exports = {
    getUpdateFields: getUpdateFields,
    getUpdateableFieldContainer: getUpdateableFieldContainer
}