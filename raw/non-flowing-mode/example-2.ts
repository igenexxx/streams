import { format } from 'node:util';
import fs from 'node:fs';

// This is our buffer to store data that will be read chunk by chunk
let dataBuffer = [];
let dataPosition = 0;
const CHUNK_SIZE = 5;

// Load some test data for demonstration purposes
// In a real scenario, this could come from a file or network source
const testData = 'This is a test string with more than 20 characters to read chunk by chunk';
dataBuffer = Buffer.from(testData);

console.log('Data loaded. Press Enter to read a chunk of 5 bytes, or press "q" to quit');

// Set up stdin for command input
process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
process.stdin.resume();

// Handle key presses for commands
process.stdin.on('data', (key) => {
  // Check for 'q' to quit
  if (key === 'q') {
    console.log('Quitting...');
    process.exit(0);
  }

  // Check for Enter key
  if (key === '\r' || key === '\n') {
    // Read the next chunk from our buffer
    if (dataPosition < dataBuffer.length) {
      const end = Math.min(dataPosition + CHUNK_SIZE, dataBuffer.length);
      const chunk = dataBuffer.slice(dataPosition, end);
      console.log(format('Chunk read (size: %d bytes): %s', chunk.length, chunk.toString()));
      dataPosition = end;

      if (dataPosition >= dataBuffer.length) {
        console.log('All data has been read');
      }
    } else {
      console.log('No more data available');
    }

    console.log('Press Enter to read the next chunk, or press "q" to quit');
  }
});

process.on('exit', () => {
  console.log('End of program');
});