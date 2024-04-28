const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors({
    origin: ["http://localhost:5173", "https://art-and-craft-79543.web.app/"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1towayy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const allCraftsCollection = client.db('allCraftsDB').collection('allcrafts');

        app.get('/', (req, res) => {
            res.send('The server is running');
        })

        app.post('/allcrafts', async (req, res) => {
            const craftItem = req.body;
            const result = await allCraftsCollection.insertOne(craftItem);
            res.send(result);
            console.log(result);
        })

        app.get('/allcrafts', async (req, res) => {
            const cursor = allCraftsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`server running in the port ${port}`);
})