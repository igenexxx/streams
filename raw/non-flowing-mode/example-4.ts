import { format } from 'node:util';
import inquirer from 'inquirer';

// This is our buffer to store data
let dataBuffer = Buffer.from('This is a test string with more than 20 characters to read chunk by chunk');
let dataPosition = 0;
const CHUNK_SIZE = 5;
let outputBuffer = [];

console.log('Data loaded. Edit each chunk and press Enter, or type "q" to quit');
processNextChunk();

async function processNextChunk() {
  if (dataPosition >= dataBuffer.length) {
    console.log('All data has been processed.');
    console.log('Final output: ' + Buffer.concat(outputBuffer).toString());
    process.exit(0);
    return;
  }

  // Read the next chunk
  const end = Math.min(dataPosition + CHUNK_SIZE, dataBuffer.length);
  const chunk = dataBuffer.slice(dataPosition, end);
  const chunkStr = chunk.toString();

  try {
    // Use inquirer to prompt with pre-filled input
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'modifiedChunk',
        message: `Chunk ${Math.floor(dataPosition/CHUNK_SIZE) + 1}:`,
        default: chunkStr,
        validate: input => {
          if (input.toLowerCase() === 'q') {
            console.log('\nQuitting...');
            process.exit(0);
          }
          return true;
        }
      }
    ]);

    // Process the edited chunk
    const modifiedText = answer.modifiedChunk;
    console.log(format('Saved: %s', modifiedText));

    // Store the modified chunk
    outputBuffer.push(Buffer.from(modifiedText));

    // Move to the next chunk position
    dataPosition = end;

    // Process the next chunk
    processNextChunk();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}