const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require ('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS }@cluster0.mthak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        const database = client.db('expertMechanic');
        const servicesCollection = database.collection('services')

        // GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services); 
        })

        // GET single service
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
           console.log('Post Api hitted', service)
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        });
        //DELETE API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my Genius mechanic server');
})

app.listen(port, () => {
    console.log('Running MY Genius Server on port', port)
})