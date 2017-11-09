const test = require('tape');
const user = require('.././user');

test('CRUD User', (t) => {
    user
        .create('test@email.com', 'testuser', 'testpassword')
        .then(created => {
            user
                .get(created._id)
                .then(found => {
                    t.isNot(created, undefined, "Created user is not null");
                    t.isNot(found, undefined, "Found user after creation is not null");
                    t.equals(created._id.toHexString(), found._id.toHexString(), "Created and found users' IDs are equal");
                    t.equals(created.email, found.email, "Created and found users' emails are equal");
                    t.equals(created.username, found.username, "Created and found users' usernames are equal");
                })
                .catch(err => t.fail("Error while getting user after creation"));
                user
                    .update(created._id, 'updatedtestemail@email.com', null, null)
                    .then(updated => {
                        user
                            .get(updated._id)
                            .then(found => {
                                t.isNot(updated, undefined, "Updated user is not null");
                                t.isNot(found, undefined, "Found user after update is not null");
                                t.equals(updated._id.toHexString(), found._id.toHexString(), "Updated and found users' IDs are equal");
                                t.equals(updated.email, found.email, "Updated and found users' emails are equal");
                                t.equals(updated.username, found.username, "Updated and found users' usernames are equal");
                            })
                            .catch(err => t.fail("Error while getting user after update"));
                            user
                                .remove(created._id)
                                .then(data => t.equals(data.success, true, "Removed user successfully"))
                                .catch(err => t.fail("Error while removing user"));
                    })
                    .catch(err => t.fail("Error while updating user"));
        })
        .catch(err => t.fail("Error while creating user"));
});