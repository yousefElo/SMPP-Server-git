function logMessage(prefix, message) {
  console.log(`[${prefix}] ${new Date().toISOString()} - ${message}`);
}

module.exports = {
  logMessage
};