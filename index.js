const http = require('http');
const https = require('https');
const { parse } = require('url');

const server = http.createServer((req, res) => {
  if (req.url === '/getTimeStories' && req.method === 'GET') {
    const url = 'https://time.com';
    
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const latestStories = extractLatestStories(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(latestStories));
      });
    }).on('error', (error) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Error: ${error.message}`);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

function extractLatestStories(html) {
  const topStories = [];

const startMarker = "<h2 class=\"latest-stories__heading\">Latest Stories</h2>\n";
const endMarker = "</time>\n            </li>\n          </ul>";

const startIndex = html.indexOf(startMarker);

const endIndex = html.indexOf(endMarker, startIndex + startMarker.length);

const extractedContent = html.substring(startIndex + startMarker.length, endIndex);
// console.log("the content is",extractedContent);

const items = extractedContent.split('<li class="latest-stories__item">');
// console.log("items are",items);

items.shift();

for (let i = 0; i < 6; i++) {
  const item = items[i];

  // Extract title
  const titleStartIndex = item.indexOf('<h3 class="latest-stories__item-headline">');
  const titleEndIndex = item.indexOf('</h3>', titleStartIndex);
  const title = item.substring(titleStartIndex + '<h3 class="latest-stories__item-headline">'.length, titleEndIndex).trim();

  // Extract link
  const linkStartIndex = item.indexOf('<a href="');
  const linkEndIndex = item.indexOf('">', linkStartIndex);
  const link = item.substring(linkStartIndex + '<a href="'.length, linkEndIndex);

  topStories.push({ title, link });
}
  return topStories;
}