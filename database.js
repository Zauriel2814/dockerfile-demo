const { Sequelize, DataTypes } = require('sequelize');

// Configure Sequelize to connect to the PostgreSQL database
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

// Define the "Record" model
const Record = sequelize.define('Record', {
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'record' // Set the table name explicitly
});

// Function to retry the sync operation
async function syncWithRetry(maxRetries, retryInterval) {
    let retries = 0;
    let connected = false;
  
    while (!connected && retries < maxRetries) {
      try {
        await sequelize.sync();
        connected = true;
        console.log('Database connection has been established successfully.');
      } catch (error) {
        retries++;
        console.error(`Error connecting to the database. Retrying in ${retryInterval / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
  
    if (!connected) {
      console.error(`Unable to connect to the database after ${maxRetries} attempts. Exiting...`);
      // Handle further actions or exit the application if desired
    }
  }

syncWithRetry(5, 3000);

// Example usage: Create a new record
async function createRecord(value) {
  try {
    const record = await Record.create({ value });
    console.log('Record created:', record.toJSON());
    return record;
  } catch (error) {
    console.error('Error creating record:', error);
    throw error;
  }
}

// Example usage: Retrieve all records
async function retrieveRecords() {
  try {
    const records = await Record.findAll();
    console.log('Records retrieved:', records.map(record => record.toJSON()));
    return records;
  } catch (error) {
    console.error('Error retrieving records:', error);
    throw error;
  }
}

module.exports = {
    createRecord,
    retrieveRecords
}