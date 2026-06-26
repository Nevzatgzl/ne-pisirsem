const { Pool } = require('pg');
require('dotenv').config();

// .env dosyasındaki şifreleri kullanarak veritabanı havuzu (pool) oluşturuyoruz
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE, // Burayı DB_NAME yerine DB_DATABASE yaptık
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
// Bağlantıyı test ediyoruz
pool.connect()
    .then(() => console.log('PostgreSQL Veritabanına Başarıyla Bağlanıldı! 🐘'))
    .catch(err => console.error('Veritabanı bağlantı hatası:', err.message));

module.exports = pool;