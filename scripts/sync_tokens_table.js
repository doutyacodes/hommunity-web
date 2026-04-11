const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    console.log('Connecting to database...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_push_tokens (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        user_type ENUM('RESIDENT', 'GUARD') NOT NULL,
        push_token VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        INDEX user_token_idx (user_id, user_type)
      )
    `);
    console.log('Table user_push_tokens created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await connection.end();
  }
}
main();
