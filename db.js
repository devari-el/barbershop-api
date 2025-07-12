const { Pool } = require('pg');

// Carrega o arquivo .env apropriado com base no ambiente
if (process.env.NODE_ENV === 'test') {
  // Se estivermos em ambiente de teste, carrega as variáveis de .env.test
  require('dotenv').config({ path: './.env.test' });
} else {
  // Caso contrário, carrega o .env padrão
  require('dotenv').config();
}

const connectionString = process.env.DATABASE_URL;

console.log(`[DB] Conectando ao banco de dados: ${connectionString}`);

// Validação para garantir que a variável de ambiente foi carregada
if (!connectionString) {
  throw new Error('DATABASE_URL não foi definida no arquivo .env apropriado.');
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};
