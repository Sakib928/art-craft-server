const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors({
    origin: ["http://localhost:5000"],
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
        const userCollection = client.db('coffeeDB').collection('user');

        app.get('/', (req, res) => {
            res.send('The server is running');
        })

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
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