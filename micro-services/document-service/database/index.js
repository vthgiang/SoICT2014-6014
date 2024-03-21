const { createConnection } = require('mongoose');

let dbConnection;

const connectToDatabase = () => {
  try {
    const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/`;

    const connectOptions = {
      user: 'root',
      pass: 'root'
    };

    dbConnection = createConnection(uri, connectOptions);
    console.log('Created connection');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

const getDbConnection = () => {
  if (!dbConnection) {
    throw new Error('Database connection has not been established.');
  }
  return dbConnection;
};

module.exports = {
  connectToDatabase,
  getDbConnection,
  dbConnection,
};
