
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:haha-haha44@localhost/medusa-store',
});

async function nuke() {
    try {
        await client.connect();
        console.log("🔥 Connected to Database. Nuking 'public' schema...");

        await client.query('DROP SCHEMA public CASCADE');
        console.log("🗑️ Schema dropped.");

        await client.query('CREATE SCHEMA public');
        console.log("✨ Schema re-created.");

        await client.query('GRANT ALL ON SCHEMA public TO postgres');
        await client.query('GRANT ALL ON SCHEMA public TO public');
        console.log("✅ Permissions granted.");

    } catch (err) {
        console.error("❌ Error nuking DB:", err);
    } finally {
        await client.end();
    }
}

nuke();
