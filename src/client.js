const smpp = require('smpp');
const config = require('./config');
const { logMessage } = require('./utils/logger');

// Create session
const session = new smpp.Session({ 
  host: config.client.host,
  port: config.client.port
});

// Handle connection events
session.on('connect', () => {
  logMessage('Client', 'Connected to SMPP server');

  // Bind as transceiver
  session.bind_transceiver({
    system_id: config.client.systemId,
    password: config.client.password
  }, (pdu) => {
    if (pdu.command_status === 0) {
      logMessage('Client', 'Successfully bound to SMPP server');
      
      // Send a test message
      sendTestMessage();
    } else {
      logMessage('Client', 'Failed to bind to SMPP server');
      session.close();
    }
  });
});

function sendTestMessage() {
  const message = {
    source_addr: '1234567890',
    destination_addr: '9876543210',
    short_message: 'Hello from SMPP client!'
  };

  session.submit_sm(message, (pdu) => {
    if (pdu.command_status === 0) {
      logMessage('Client', 'Test message sent successfully');
    } else {
      logMessage('Client', 'Failed to send test message');
    }
    
    // Close the session after sending the test message
    session.close();
  });
}

session.on('error', (error) => {
  logMessage('Client', `Error: ${error.message}`);
});

session.on('close', () => {
  logMessage('Client', 'Session closed');
  process.exit(0);
});

// Handle process termination
process.on('SIGINT', () => {
  logMessage('Client', 'Shutting down SMPP client...');
  session.close();
});