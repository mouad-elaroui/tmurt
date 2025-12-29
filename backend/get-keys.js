
const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    connectionString: 'postgres://postgres:haha-haha44@localhost/medusa-store',
});

async function getKeys() {
    try {
        await client.connect();
        const res = await client.query("SELECT token FROM api_key WHERE type = 'publishable' LIMIT 1");
        if (res.rows.length > 0) {
            const token = res.rows[0].token;
            fs.writeFileSync('NEW_API_KEY.txt', token, 'utf8');
            console.log("Token written to NEW_API_KEY.txt");
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

getKeys();
