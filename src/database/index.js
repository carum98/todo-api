import mysql from 'mysql2'

export async function query(sql) {
    try {
        const con = mysql.createConnection({
            host: 'db',
            port: 3306,
            user: 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })
        
        const [rows, fields] = await con.promise().query(sql)

        return rows
    } catch (error) {
        console.error('Error connecting to database', error)
    }
}
