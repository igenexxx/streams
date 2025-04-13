import readlineSync from 'readline-sync';
import { format } from 'node:util';

// This is our buffer to store data
let dataBuffer = Buffer.from('This is a test string with more than 20 characters to read chunk by chunk');
let dataPosition = 0;
const CHUNK_SIZE = 5;
let outputBuffer = [];

console.log('Data loaded. Edit each chunk and press Enter, or type "q" to quit');
processChunks();

function processChunks() {
  while (dataPosition < dataBuffer.length) {
    // Read the next chunk
    const end = Math.min(dataPosition + CHUNK_SIZE, dataBuffer.length);
    const chunk = dataBuffer.slice(dataPosition, end);
    const chunkStr = chunk.toString();

    console.log(`Chunk ${Math.floor(dataPosition/CHUNK_SIZE) + 1}:`);

    // Use readline-sync's questionEdit to enable inline editing
    const modifiedText = readlineSync.questionEdit({
      defaultInput: chunkStr,
      prompt: '> ',
      keepWhitespace: true
    });

    if (modifiedText.toLowerCase() === 'q') {
      console.log('Quitting...');
      break;
    }

    // Process the edited chunk
    console.log(format('Saved: %s', modifiedText));

    // Store the modified chunk
    outputBuffer.push(Buffer.from(modifiedText));

    // Move to the next chunk position
    dataPosition = end;
  }

  if (dataPosition >= dataBuffer.length) {
    console.log('All data has been processed.');
    console.log('Final output: ' + Buffer.concat(outputBuffer).toString());
  }
}