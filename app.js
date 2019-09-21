var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server); // Bind socket.io to our express server.
var ejs = require('ejs');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


app.get('/', function(req, res){
    res.render('index');
});

// get request for fitness mode page
app.get('/fitnessMode', function(req, res){
    res.render('fitnessMode');
});

// get request for stress monitoring mode page
app.get('/stressMonitoringMode', function(req, res){
    res.render('stressMonitoringMode');
});

// get request for meditation mode page
app.get('/meditationMode', function(req, res){
    res.render('meditationMode');
});


// Start the server, listening on port 3000
server.listen(3000, () => {
    console.log("Listening to requests on port 3000...");
});

const SerialPort = require('serialport'); 
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('COM3'); //Connect serial port to port COM3. Because my Arduino Board is connected on port COM3. See yours on Arduino IDE -> Tools -> Port
const parser = port.pipe(new Readline({delimiter: '\r\n'})); //Read the line only when new line comes.

parser.on('data', (rate) => { // Read data
    console.log(rate);
    var today = new Date();
    // emit the data
    io.sockets.emit('rate', { time: (today.getMinutes())+":"+(today.getSeconds())+":"+(today.getMilliseconds()), rate: rate });
});

io.on('user_age_input', function(input){
    port.write(input);
});

io.on('connection', (socket) => {
    console.log("Someone connected."); //show a log as a new client connects.
});