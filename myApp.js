const express = require('express');
const helmet = require('helmet');
const app = express();
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;

app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(
  helmet.ieNoOpen(),
  helmet.hsts({ maxAge: (timeInSeconds = ninetyDaysInSeconds), force: true }),
  helmet.dnsPrefetchControl(),
  helmet.noCache(),
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com'],
    },
  })
);

var bcrypt = require('bcrypt');

const myPlaintextPassword = 'passw0rd!';
const saltRounds = 13;
const someOtherPlaintextPassword = 'jeeeeeeex!!!!';

//START_SYNC
var hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
console.log(hash);
var result = bcrypt.compareSync(myPlaintextPassword, hash);
console.log(result);
let result2 = bcrypt.compareSync(someOtherPlaintextPassword, hash);
console.log(result2);
//END_SYNC

module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
