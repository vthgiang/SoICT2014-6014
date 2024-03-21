db = db.getSiblingDB('vnist');
db.createUser(
    {
        user: 'root',
        pwd:  'root',
        roles: [{role: 'readWrite', db: 'vnist'}],
    }
);

db = db.getSiblingDB('vnist_db');
db.createUser(
    {
        user: 'root',
        pwd:  'root',
        roles: [{role: 'readWrite', db: 'vnist_db'}],
    }
);
