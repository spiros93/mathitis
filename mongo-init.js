db.createUser(
    {
        user: "test",
        pwd: "mauFJcuf5dhRMQrjjsc",
        roles: [
            {
                role: "readWrite",
                db: "terDb"
            }
        ]
    }
);


db = db.getSiblingDB('terDb')
db.createCollection('users')
db.collection('users').insert({
    username: 'admin',
    // password: 'wqtsdsbjui!#4',
    // givenName: 'admin',
    // surName: 'wqtsdsbjui!#4',
    // age: 34,
    // email: 'admin@gmail.com',
    // address: '',
    // photoURL: '',
    // isAdmin: true,

  });