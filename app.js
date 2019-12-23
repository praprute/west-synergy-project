const express      = require('express')
const app          = express()
const cors         = require('cors')
const bodyParser   = require('body-parser')
const mysql        = require('mysql')
const myConnection = require('express-myconnection')
const configdata   = require('./confix')
const routes       = require('./route')

const PORT = 3020;

app.use(cors());
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true
    })
);

app.use(
    bodyParser.json({
        limit: "50mb"
    })
);


app.use(myConnection(mysql, configdata.dbOption, "pool"));
routes(app);

app.listen(PORT, () => {
    console.log("ready server on http://localhost:" + PORT);
});
