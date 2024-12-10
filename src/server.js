const smpp = require('smpp');
const config = require('./config');
const { logMessage } = require('./utils/logger');

const server = smpp.createServer({}, (session) => {
  const clientAddress = session.socket.remoteAddress;
  logMessage('Server', `New SMPP session established from IP: ${clientAddress}`);

  session.on('bind_transceiver', (pdu) => {
    const { system_id, password } = pdu;
    
    if (system_id === config.client.systemId && password === config.client.password) {
      logMessage('Server', `Client ${clientAddress} authenticated successfully`);
      session.send(pdu.response());
    } else {
      logMessage('Server', `Authentication failed for client ${clientAddress}`);
      session.send(pdu.response({ command_status: smpp.ESME_RBINDFAIL }));
    }
  });

  session.on('submit_sm', (pdu) => {
    // Display message details
    logMessage('Server', `Received SMS from ${clientAddress}:`);
    logMessage('Server', `From: ${pdu.source_addr}`);
    logMessage('Server', `To: ${pdu.destination_addr}`);
    logMessage('Server', `Message: ${pdu.short_message.message}`);

    // Send success response
    session.send(pdu.response());
  });

  session.on('unbind', (pdu) => {
    logMessage('Server', `Unbind request received from ${clientAddress}`);
    
    // Send success response for unbind
    session.send(pdu.response());
    
    // Close the session after sending the response
    logMessage('Server', `Closing session for ${clientAddress} after unbind`);
    session.close();
  });

  session.on('error', (error) => {
    logMessage('Server', `Error from ${clientAddress}: ${error.message}`);
  });

  session.on('close', () => {
    logMessage('Server', `Session closed for ${clientAddress}`);
  });
});

server.listen(config.server.port, () => {
  logMessage('Server', `SMPP server listening on port ${config.server.port}`);
});

process.on('SIGINT', () => {
  logMessage('Server', 'Shutting down SMPP server...');
  server.close(() => {
    process.exit(0);
  });
});
