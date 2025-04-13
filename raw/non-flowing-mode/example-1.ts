import { format } from 'node:util';

process.stdin.on('readable', () => {
  let chunk;

  console.log('Reading from stdin...');
  while((chunk = process.stdin.read(5)) !== null) {
    console.log(format('Chunk read (size: %d) bytes): %s', chunk.length, chunk));
  }
}).on('end', () => console.log('End of stream'));