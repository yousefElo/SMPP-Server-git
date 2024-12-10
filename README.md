# SMPP Server and Client

A Node.js implementation of an SMPP (Short Message Peer-to-Peer) server and client. This project provides a simple SMPP server that can receive and log SMS messages, along with a test client for validation.

## Features

- SMPP server that handles incoming connections and messages
- Display of source IP for new connections
- Logging of message details (origin address, destination address, SMS body)
- Proper handling of unbind messages
- Test client for server validation
- Support for offline deployment

## Prerequisites

- Node.js (v14 or higher)
- RedHat Linux system
- Systemd for service management

## Project Structure

```
├── src/
│   ├── server.js         # SMPP server implementation
│   ├── client.js         # Test client implementation
│   ├── config.js         # Configuration settings
│   └── utils/
│       └── logger.js     # Logging utility
├── package.json
└── download-dependencies.js
```

## Offline Deployment Guide

### 1. Prepare Dependencies (On Online Machine)

1. Clone this repository on a machine with internet access
2. Run the dependency download script:
   ```bash
   node download-dependencies.js
   ```
3. Copy the generated `smpp-offline-packages.tar.gz` to your offline RedHat machine

### 2. Install on Offline Machine

1. Create a project directory:
   ```bash
   mkdir /opt/smpp-server
   cd /opt/smpp-server
   ```

2. Copy your project files to this directory
   ```bash
   cp -r /path/to/project/* /opt/smpp-server/
   ```

3. Extract the dependencies:
   ```bash
   tar -xzf smpp-offline-packages.tar.gz
   ```

### 3. Create Systemd Service

1. Create a service file:
   ```bash
   sudo vi /etc/systemd/system/smpp-server.service
   ```

2. Add the following content:
   ```ini
   [Unit]
   Description=SMPP Server
   After=network.target

   [Service]
   Type=simple
   User=smpp
   WorkingDirectory=/opt/smpp-server
   ExecStart=/usr/bin/node src/server.js
   Restart=always
   RestartSec=10
   StandardOutput=syslog
   StandardError=syslog
   SyslogIdentifier=smpp-server

   [Install]
   WantedBy=multi-user.target
   ```

### 4. Setup System User

1. Create a dedicated user:
   ```bash
   sudo useradd -r -s /bin/false smpp
   ```

2. Set permissions:
   ```bash
   sudo chown -R smpp:smpp /opt/smpp-server
   sudo chmod -R 755 /opt/smpp-server
   ```

### 5. Start the Service

1. Reload systemd:
   ```bash
   sudo systemctl daemon-reload
   ```

2. Enable the service:
   ```bash
   sudo systemctl enable smpp-server
   ```

3. Start the service:
   ```bash
   sudo systemctl start smpp-server
   ```

### 6. Monitor the Service

- Check service status:npm run start:server
  ```bash
  sudo systemctl status smpp-server
  ```

- View logs:
  ```bash
  sudo journalctl -u smpp-server -f
  ```

## Configuration

The server configuration is stored in `src/config.js`. Default settings:
- Server port: 2775
- Host: 127.0.0.1
- System ID and password are configurable

## Testing

1. Start the server:
   ```bash
   npm run start:server
   ```

2. In a separate terminal, run the test client:
   ```bash
   npm run start:client
   ```

The client will:
1. Connect to the server
2. Send a test message
3. Properly unbind
4. Close the connection

## Security Considerations

1. Change default credentials in `config.js`
2. Use firewall rules to restrict access to the SMPP port
3. Monitor system logs for unauthorized access attempts
4. Regularly update Node.js and dependencies when possible

## Troubleshooting

1. Service won't start:
   - Check logs: `journalctl -u smpp-server -n 50`
   - Verify permissions on /opt/smpp-server
   - Ensure Node.js is installed correctly

2. Connection issues:
   - Verify firewall settings
   - Check if port 2775 is available
   - Ensure config.js has correct host/port settings

3. Permission issues:
   - Verify smpp user ownership: `ls -l /opt/smpp-server`
   - Check systemd service user configuration