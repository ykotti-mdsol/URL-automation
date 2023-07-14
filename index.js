const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

require("dotenv").config();

const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });
//app.use(morgan('combined', { stream: accessLogStream }));

app.use(morgan(':date :url :method :total-time :status :response-time', { stream: accessLogStream }))

app.use(express.json());

app.use(cors());

app.get('/',(req,res)=>{
    return res.send("Hello");
});

const authenticateJWT = require("./middleware/auth");
//app.use(authenticateJWT);

const loginRoute = require("./routes/login");
app.use("/login",loginRoute);

const databagRoute = require("./routes/generateDatabag");
app.use("/generateDatabag",databagRoute);

const deployNew = require("./routes/deploy");
app.use("/deployURL",deployNew);

const testNew = require("./routes/test");
app.use("/test",testNew);


app.listen(process.env.PORT,()=>{
    console.log('Server running on port '+(process.env.PORT));
});