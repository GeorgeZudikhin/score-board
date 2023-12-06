const http = require('http');
const app = require('./app');
const db = require("./db.js");
db.connect();

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, function(err) {
    if (err) {
        console.log(`CRUCIAL ERROR`);
        return console.error(err);
    }
    console.log(`Server running on port ${port}`);
});