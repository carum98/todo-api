export default {
    host: 'db',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}