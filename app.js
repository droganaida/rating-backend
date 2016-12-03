
var express = require('express');
var http = require('http');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var myconfig = require('./libs/myconfig');

var app = express();

//------- Определяем директорию public для хранения скриптов,
//------- стилей, картинок и прочей статики
app.use(express.static(path.join(__dirname, 'public')));

//-------- Объявляем директорию для темплейт и движок для их отображения.
//-------- Я выбрала ejs
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

//--------- Подключаем bodyParser, чтобы получить данные с клиента
//--------- Обязательно подключаем bodyParser до require('./routes')(app)
//--------- иначе тебе приснится Киркоров!
app.use(bodyParser.urlencoded({
    extended: true
}));

//--------- Заводим хранилище сессий пользователей
//--------- Все настройки я вынесла в конфиг (/libs/myconfig)
var sessionStore = require('./libs/sessionStore');
app.use(session({
    secret: myconfig.session.secret,
    key: myconfig.session.key,
    cookie: myconfig.session.cookie,
    store: sessionStore
}));

//--------- А вот и роуты
require('./routes')(app);

//--------- И наконец сервер
var httpServer = http.createServer(app);
var port = myconfig.port;

function onListening(){
    console.log('Вишу на порту %d', port);
}

httpServer.on('listening', onListening);

//---------- Указываем серверу порт и ip localhost
// если не указать ip, не достучишься до сервера по локальной сети. Проверено =)
httpServer.listen(port, '127.0.0.1');

