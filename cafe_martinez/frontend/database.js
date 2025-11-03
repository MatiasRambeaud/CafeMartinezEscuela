const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cafe'
});

connection.connect((err) => {
  if (err) {
    console.error('Error database', err);
    return;
  }
  console.log('Conexion exitosa a MYSQL');
});

module.exports = connection;
