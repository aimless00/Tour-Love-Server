const { MongoClient } = require('mongodb');
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const Objectid = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

// middleWare

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jam0x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("tourLover");
        const tourCollection = database.collection("tour");
        const orderCollection = database.collection('order');

        //Get data
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers)
        })

        //GEt POST
        app.post('/tours', async (req, res) => {
            const newTour = req.body;
            const result = await tourCollection.insertOne(newTour);
            res.json(result);
        });

        //post order
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result)

        })

        //get order
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order)
        })

        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: Objectid(id) };
            const tour = await tourCollection.findOne(query);
            res.send(tour)
        })

        //Delete api

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: Objectid(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        });

        //update 
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const result = orderCollection.updateOne({ _id: Objectid(id) }, {
                $set: {
                    status: updateOrder.status
                }
            })
            res.send(result)
            console.log(id, updateOrder, result);
        })


    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my CRUD server');
});

app.listen(port, () => {
    console.log('Running server on port', port);
});