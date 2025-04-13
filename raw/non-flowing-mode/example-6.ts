import * as readline from 'node:readline';
import { format } from 'node:util';
import { stdin as input, stdout as output } from 'node:process';

// This is our buffer to store data
let dataBuffer = Buffer.from('This is a test string with more than 20 characters to read chunk by chunk');
let dataPosition = 0;
const CHUNK_SIZE = 5;
let outputBuffer = [];

const rl = readline.createInterface({ input, output });

console.log('Data loaded. Edit each chunk and press Enter, or type "q" to quit');
processNextChunk();

function processNextChunk() {
  if (dataPosition >= dataBuffer.length) {
    console.log('All data has been processed.');
    console.log('Final output: ' + Buffer.concat(outputBuffer).toString());
    rl.close();
    return;
  }

  // Read the next chunk
  const end = Math.min(dataPosition + CHUNK_SIZE, dataBuffer.length);
  const chunk = dataBuffer.slice(dataPosition, end);
  const chunkStr = chunk.toString();

  // Display the chunk to be edited
  console.log(`\nChunk ${Math.floor(dataPosition/CHUNK_SIZE) + 1}:`);
  console.log(`Current: [${chunkStr}]`);

  // Using a trick - writing the chunk to the terminal then setting cursor back
  output.write('> ');
  output.write(chunkStr);

  // Create a listener for keypresses
  const keypressListener = (char, key) => {
    if (key && key.name === 'return') {
      // When Enter is pressed, remove the listener
      input.removeListener('keypress', keypressListener);
      input.setRawMode(false);

      // Get the input line
      const line = rl.line;

      if (line.toLowerCase() === 'q') {
        console.log('\nQuitting...');
        rl.close();
        return;
      }

      // Process the edited chunk
      console.log(format('\nSaved: %s', line));

      // Store the modified chunk
      outputBuffer.push(Buffer.from(line));

      // Move to the next chunk position
      dataPosition = end;

      // Continue with next chunk after a brief delay to allow terminal to reset
      setTimeout(processNextChunk, 100);
    }
  };

  // Setup for raw input mode to handle keypresses
  input.on('keypress', keypressListener);
  input.setRawMode(true);
}

rl.on('close', () => {
  console.log('End of program');
  process.exit(0);
});