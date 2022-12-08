const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'minubiz-docs';

const database = (() => {
  let client

  const init = async () => {
    client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    
    return db
  }

  const close = async () => {
    await client.close()
  }

  return {
    init,
    close
  }
})();

module.exports = database