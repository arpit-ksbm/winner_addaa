
const cors = require('cors')
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const port =  3000;
const dbConnect = require('./src/config/dbConnect')
const path = require('path')
const app = express()

// const Routes = require("./src/routes/index")


// const { Error } = require('./src/utils/helper')
// const morgan = require('morgan');


// app.use((morgan('dev')));


app.use(cors(({
  origin: '*',
  credentials: true,
})))

app.use(express.json({ limit: '1005mb' }));

app.use(express.json())

//***************************************************************************** */

app.use(express.urlencoded({ extended: true }));

app.use("/", require('express').static(path.join(__dirname, 'public')));

app.use(cookieParser());

// app.use((err, req, res, next) => {
//   if (err) return Error(res, -1, err.status, err.message);
//   next();
// });

// app.use('/api', Routes)

app.listen(port, () => {
  dbConnect()
  console.log(`Server listening on port http://localhost:${port}`)
})