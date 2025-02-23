const http = require('http');
const { Readable, pipeline } = require('stream');

const CHUNK_DELAY_MS = 130;
const PORT = 3000;

const data = {
  meta: {
    id: '123',
    timestamp: Date.now(),
    type: 'text'
  },
  content: `This is a streaming example. Let's send some data over time. Here's line three. And here's the final line.`
};

/**
 * Creates a readable stream that pushes words one by one.
 * After sending all individual words, it pushes a JSON string with metadata and the full content.
 */
function createContentStream() {
  const readable = new Readable({
    read() {}
  });

  const words = data.content.split(' ');
  let index = 0;

  const interval = setInterval(() => {
    if (index < words.length) {
      readable.push(words[index] + ' ');
      index++;
    } else {
      readable.push(JSON.stringify({
        meta: data.meta,
        content: data.content
      }));
      readable.push(null);
      clearInterval(interval);
    }
  }, CHUNK_DELAY_MS);

  readable.on('error', (err) => {
    console.error('Readable stream error:', err);
  });

  return readable;
}

const server = http.createServer((req, res) => {
  if (req.url === '/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Transfer-Encoding': 'chunked'
    });

    const contentStream = createContentStream();

    // Use pipeline to pipe the readable stream into the response
    pipeline(contentStream, res, (err) => {
      if (err) {
        console.error('Pipeline failed:', err);
      } else {
        console.log('Pipeline completed successfully');
      }
    });

    // Attach an error listener on the response in case of issues
    res.on('error', (err) => {
      console.error('Response stream error:', err);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown function
function shutdown() {
  console.log('Shutting down server gracefully...');
  server.close((err) => {
    if (err) {
      console.error('Server shutdown error:', err);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);