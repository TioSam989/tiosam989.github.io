const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Determine the requested URL
    const requestedUrl = req.url;

    // Serve HTML file if the URL is '/'
    if (requestedUrl === '/' || requestedUrl === '/adult.html') {
        const htmlFilePath = path.join(__dirname, 'adult.html');

        fs.readFile(htmlFilePath, 'utf8', (err, htmlData) => {
            if (err) {
                console.error(`Error reading HTML file: ${err}`);
                res.statusCode = 500;
                res.end('Internal Server Error');
                return;
            }

            res.setHeader('Content-Type', 'text/html');
            res.end(htmlData);
        });
    } else {
        // For other URLs, serve JSON data (similar to your previous code)
        res.setHeader('Content-Type', 'application/json');

        // Define the path to the kamaPos.json file
        const kamaPosFilePath = path.join(__dirname, 'kamaPos.json');
        const objectList = [];

        // Create a function to read JSON files synchronously
        const readFileSync = (filePath) => {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            } catch (err) {
                console.error(`Error reading JSON file: ${err}`);
                return null;
            }
        };

        // Read the kamaPos.json file and include its data
        const kamaPosData = readFileSync(kamaPosFilePath);

        // Include kamaPosData in the response
        res.end(JSON.stringify({ kamaPos: kamaPosData, objects: objectList }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
