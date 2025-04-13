import { format } from 'node:util';
import * as readline from 'node:readline';

// This is our buffer to store data
let dataBuffer = Buffer.from('This is a test string with more than 20 characters to read chunk by chunk');
let dataPosition = 0;
const CHUNK_SIZE = 5;

// Create a readline interface for interactive editing
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Data loaded. Press Enter to read and edit chunks, or type "q" to quit');
processNextChunk();

function processNextChunk() {
  if (dataPosition >= dataBuffer.length) {
    console.log('All data has been processed.');
    rl.close();
    return;
  }

  // Read the next chunk
  const end = Math.min(dataPosition + CHUNK_SIZE, dataBuffer.length);
  const chunk = dataBuffer.slice(dataPosition, end);

  // Prompt the user to edit the chunk
  rl.question(`Edit chunk (size: ${chunk.length} bytes): ${chunk.toString()} -> `, (input) => {
    if (input.toLowerCase() === 'q') {
      console.log('Quitting...');
      rl.close();
      return;
    }

    // Process the edited chunk
    console.log(format('Modified chunk: %s', input));

    // Here you would do something with the modified chunk
    // For example, store it in a new buffer

    // Move to the next chunk position
    dataPosition = end;

    // Process the next chunk
    processNextChunk();
  });
}

rl.on('close', () => {
  console.log('End of program');
  process.exit(0);
});