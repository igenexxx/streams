const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/stream') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Transfer-Encoding', 'chunked'); // Important for chunked responses

    const data = "This is a long string that will be sent in chunks.";
    const chunkSize = 10; // Adjust chunk size as needed
    let currentIndex = 0;

    const sendNextChunk = () => {
      if (currentIndex >= data.length) {
        res.end(); // Signal the end of the stream
        return;
      }

      const chunk = data.substring(currentIndex, currentIndex + chunkSize);
      currentIndex += chunkSize;

      res.write(chunk); // Send the chunk
      setTimeout(sendNextChunk, 500); // Simulate network latency (adjust as desired)
    };

    sendNextChunk();
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(require('fs').readFileSync('index.html'));
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});