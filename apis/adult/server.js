const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Determine the requested URL
    const requestedUrl = req.url;

    if (req.method === 'POST' && requestedUrl === '/add-item') {
        // Handle POST requests to add an item to the JSON file
        let requestBody = '';
        
        req.on('data', (data) => {
            // Recebe os dados do corpo da requisição POST
            requestBody += data.toString();

            console.log(data)
        });
        
        req.on('end', () => {
            // Parse do corpo da requisição como JSON
            const newItem = JSON.parse(requestBody);

            // Define o caminho para o arquivo kamaPos.json
            const kamaPosFilePath = path.join(__dirname, 'kamaPos.json');

            // Lê os dados JSON existentes no arquivo
            fs.readFile(kamaPosFilePath, 'utf8', (err, jsonData) => {
                if (err) {
                    console.error(`Error reading JSON file: ${err}`);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                    return;
                }
                console.log('Listening...')

                try {

                    console.log('tryng')
                    // Faz o parse dos dados JSON existentes
                    const existingData = JSON.parse(jsonData);

                    // Adiciona o novo item aos dados existentes

                    console.log(newItem)
                    console.log(jsonData)
                    // existingData.objects.push(newItem);

                    // Escreve os dados atualizados de volta no arquivo
                    fs.writeFile(kamaPosFilePath, JSON.stringify(existingData, null, 2), (writeErr) => {
                        if (writeErr) {
                            console.error(`Error writing JSON file: ${writeErr}`);
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                            return;
                        }

                        // Responde com uma mensagem de sucesso
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Item added successfully' }));
                    });
                } catch (parseError) {
                    console.error(`Error parsing existing JSON data: ${parseError}`);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                }
            });
        });
    } else if (requestedUrl === '/' || requestedUrl === '/adult.html') {
        // Serve o arquivo HTML
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
        // Serve os dados JSON (similar ao seu código anterior)
        res.setHeader('Content-Type', 'application/json');

        // Define o caminho para o arquivo kamaPos.json
        const kamaPosFilePath = path.join(__dirname, 'kamaPos.json');
        const objectList = [];

        // Função para ler arquivos JSON de forma síncrona
        const readFileSync = (filePath) => {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            } catch (err) {
                console.error(`Error reading JSON file: ${err}`);
                return null;
            }
        };

        // Lê o arquivo kamaPos.json e inclui seus dados na resposta
        const kamaPosData = readFileSync(kamaPosFilePath);

        // Inclui kamaPosData na resposta
        res.end(JSON.stringify({ kamaPos: kamaPosData, objects: objectList }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
