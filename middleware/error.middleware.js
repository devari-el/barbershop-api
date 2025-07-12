const errorHandler = (err, req, res, next) => {
  // Loga o erro no console para fins de depuração no servidor.
  // Em um ambiente de produção real, isso seria substituído por um sistema de logging mais robusto (ex: Winston, Sentry).
  console.error('ERRO CAPTURADO PELO HANDLER:', err.stack);

  // Envia uma resposta de erro padronizada para o cliente
  res.status(500).json({
    message: 'Ocorreu um erro inesperado no servidor.',
    // Em ambiente de desenvolvimento, podemos enviar a mensagem de erro para facilitar a depuração.
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

module.exports = errorHandler;