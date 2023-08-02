

const originalConsoleLog = console.log;
const isLoggingEnabled = false; // Set this to true or false as needed

console.log = function (message) {
  if (isLoggingEnabled) {
    // You can add any custom logic here, e.g., formatting the log message
    originalConsoleLog(message);
  }
};
