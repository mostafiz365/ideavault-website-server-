const dns = require("node:dns");
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const port = process.env.PORT || 5000;
dotenv.config();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("ideavault")
    const ideasCollection = db.collection("ideas");
    const myIdeasCollection = db.collection("myIdeas");

    app.get('/ideas', async(req, res) =>{
      const result = await ideasCollection.find().toArray();
      res.send(result);
    })

    app.get('/ideas/:id', async(req, res) =>{
      const id = req.params.id;
      const result = await ideasCollection.findOne({_id: new ObjectId(id)});
      res.send(result)
    })

    app.post('/ideas', async(req, res) =>{
      const newIdea = req.body;
      const result = await ideasCollection.insertOne(newIdea);
      res.send(result);
    })

    app.get('/myIdeas/:userId', async(req, res) =>{
      const userId = req.params.userId;
      const result = await myIdeasCollection.find({userId}).toArray();
      res.send(result);
    })

    app.post('/myIdeas', async(req, res) =>{
      const myIdeasData = req.body;
      const result = await myIdeasCollection.insertOne(myIdeasData);
      res.send(result)
    })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Hello World!');
})

app.listen(port, () =>{
    console.log('server is running on port 5000');
})