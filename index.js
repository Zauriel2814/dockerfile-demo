require("dotenv").config()
const {
    createRecord,
    retrieveRecords
} = require("./database");
const express = require('express')
const app = express()

app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post("/value", async function(req, res) {
    const created = await createRecord(req.body.value);
    res.json(created);
});

app.get("/value", async function(req, res){
    const result = await retrieveRecords();
    res.json(result);
})

if(!process.env.PORT){
    throw "PORT is not set in environmental variable";
}

app.listen(process.env.PORT)