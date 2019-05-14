/* Development ja test modessa käytetään .env-tiedostossa määriteltyjä
MONDGODB_URI, PORT=3003, SECRET
*/
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

/* Production modessa
PORT ja tietokannan url on asetettu ympäristön toimesta.
Ne luetaan process.env:istä,
*/
let PORT = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

/* Test modessa
tietokannan url on eri, kuin development modessa
*/
if(process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.TEST_MONGODB_URI
}

module.exports = {
  mongoUrl,
  PORT
}