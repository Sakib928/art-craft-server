const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors({
    origin: ['http://localhost:5173', 'https://art-and-craft-79543.web.app', 'https://scribble-art-and-craft.netlify.app'],
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
            // console.log(result);
        })

        app.get('/allcrafts', async (req, res) => {
            const cursor = allCraftsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/mycrafts/:email', async (req, res) => {
            const user = req.params.email;
            const query = { filterMail: user };
            const cursor = await allCraftsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allCraftsCollection.findOne(query);
            res.send(result);
        })

        app.get('/crafts/:subCategory', async (req, res) => {
            let subCategory = req.params.subCategory;
            subCategory = subCategory.replace('_', ' ');
            const query = { subCategory: subCategory };
            const cursor = allCraftsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/')

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = {
                upsert: true
            }
            const updateItem = req.body;
            const updatedItem = {
                $set: {
                    itemName: updateItem.itemName,
                    photoURL: updateItem.photoURL,
                    subCategory: updateItem.subCategory,
                    shortDescription: updateItem.shortDescription,
                    price: updateItem.price,
                    rating: updateItem.rating,
                    customization: updateItem.customization,
                    prcessingTime: updateItem.prcessingTime,
                    currentStock: updateItem.currentStock

                }
            }
            const result = await allCraftsCollection.updateOne(filter, updatedItem, options);
            res.send(result);
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await allCraftsCollection.deleteOne(filter);
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
    console.log(`server is running at port ${port}`);
})