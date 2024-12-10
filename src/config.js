const config = {
  server: {
    port: 2775,
    host: '127.0.0.1',
    systemId: 'SMPP_SERVER',
    password: 'secret123'
  },
  client: {
    port: 2775,
    host: '127.0.0.2',
    systemId: 'SMPP_CLIENT',
    password: 'secret12'
  }
};

module.exports = config;
