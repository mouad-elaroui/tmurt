const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: 'haha-haha44',
  host: 'localhost',
  database: 'postgres',
  port: 5432,
});

async function createDb() {
  try {
    await client.connect();
    // Check if exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'medusa-store'");
    if (res.rowCount === 0) {
        await client.query('CREATE DATABASE "medusa-store";');
        console.log('Database medusa-store created successfully');
    } else {
        console.log('Database medusa-store already exists');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDb();
