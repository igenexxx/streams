// server.js
const http = require('http');
const { Readable } = require('stream');

// Sample data
const data = {
  meta: {
    id: '123',
    timestamp: Date.now(),
    type: 'text'
  },
  content: `This is a streaming example. Let's send some data over time. Here's line three. And here's the final line.`
};

// Create a readable stream that pushes words one by one
function createContentStream() {
  const readable = new Readable({
    read() {}
  });

  // Split content into words based on spaces.
  // You might adjust the splitting logic if punctuation is important.
  const words = data.content.split(' ');
  let index = 0;

  const interval = setInterval(() => {
    if (index < words.length) {
      // Optionally, add a space back to separate words.
      readable.push(words[index] + ' ');
      index++;
    } else {
      // Once all words are pushed, push a final JSON string with metadata and full content.
      readable.push(JSON.stringify({
        meta: data.meta,
        content: data.content
      }));
      readable.push(null); // End the stream
      clearInterval(interval);
    }
  }, 130); // Push a word every second

  return readable;
}

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Transfer-Encoding': 'chunked'
    });

    const stream = createContentStream();

    stream.on('data', (chunk) => {
      res.write(chunk);
    });

    stream.on('end', () => {
      res.end();
    });

  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});