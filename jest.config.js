module.exports = {
  // Define o ambiente de teste que o Jest usará. 'node' é ideal para testes de back-end.
  testEnvironment: 'node',

  // Garante que qualquer mock seja resetado entre os testes.
  // Isso previne que um mock configurado em um teste afete o resultado de outro.
  clearMocks: true,

  // Define um tempo limite de 10 segundos por teste, para evitar que testes fiquem presos indefinidamente.
  testTimeout: 10000,
};
