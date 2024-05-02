
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// add middleware
app.use(
  cors({
      origin: ['http://localhost:5173', 'https://assignment-10-7d341.web.app'],
      credentials: true,
  }),
)
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d5v1sm5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
   

    const artAndCraftsCollection = client.db('artAndCraftsDB').collection('artAndCraftCollection')

// Read
app.get('/artAndCrafts',async(req,res) =>{
    const cursor = artAndCraftsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

// for details page
app.get('/artAndCrafts/:id', async(req,res) =>{
    const id = req.params.id;
    console.log({id})
    const query = {_id: new ObjectId(id)}
    const result = await artAndCraftsCollection.findOne(query);
    res.send(result);
})

// for my art and craft list
app.get('/MyArtAndCrafts/:email', async(req,res) =>{
  const email = req.params.email
  const result  = await artAndCraftsCollection.find({email})
  .toArray();
  
  res.send(result)
})

// create
  app.post('/artAndCrafts', async (req,res) =>{
    const newData = req.body
    console.log(newData)
    const result = await artAndCraftsCollection.insertOne(newData);
    res.send(result)
  })

  // update
  app.put('/artAndCrafts/:id', async (req,res) =>{
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    const options = {upsert : true}
    const updateItem = req.body
    const item = {
      $set:{
        item: updateItem.item,
        image: updateItem.image,
        subCategory: updateItem.subCategory,
        description: updateItem.description,
        price: updateItem.price,
        rating: updateItem.rating,
        customize: updateItem.customize,
        processTime: updateItem.processTime,
        stockStatus: updateItem.stockStatus,
      
      }
    }
    const result = await artAndCraftsCollection.updateOne(filter,item, options)
    res.send(result)
  })

  // Delete
  app.delete('/artAndCrafts/:id', async (req,res) =>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await artAndCraftsCollection.deleteOne(query)
    res.send(result)
  })


    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);



app.get('/', (req,res) =>{
    res.send('art and craft server is running')
})

app.listen(port, () =>{
    console.log(`art and craft server is running on port: ${port}`)
})