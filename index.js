const express = require('express')
// const packageName = require('packageName')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ua9xvba.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      const indoorServiceCollection = client.db('origin-db').collection('indoorservices')
      const outdoorServiceCollection = client.db('origin-db').collection('outdoorservices')
      const otherServiceCollection = client.db('origin-db').collection('otherservices')

      

      app.post('/indoor-services', async(req, res)=>{
        const service = req.body
    
        const query ={
          serviceCategory: service.serviceCategory,
          serviceName: service.name
            
        }
        const result = await indoorServiceCollection.insertOne(query)
        res.send(result)

    })
      app.post('/outdoor-services', async(req, res)=>{
        const service = req.body
    
        const query ={
          serviceCategory: service.serviceCategory,
          serviceName: service.name
            
        }
        const result = await outdoorServiceCollection.insertOne(query)
        res.send(result)

    })
      app.post('/other-services', async(req, res)=>{
        const service = req.body
    
        const query ={
          serviceCategory: service.serviceCategory,
          serviceName: service.name
            
        }
        const result = await otherServiceCollection.insertOne(query)
        res.send(result)

    })

    app.get('/indoor-services', async(req, res)=>{
      const query ={};
      const cursor = indoorServiceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result);
    })

    app.get('/outdoor-services', async(req, res)=>{
      const query ={};
      const cursor = outdoorServiceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result);
    })
    app.get('/other-services', async(req, res)=>{
      const query ={};
      const cursor = otherServiceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result);
    })
      
    app.delete('/delete-indoor-service/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: ObjectId(id)}
      const result = await indoorServiceCollection.deleteOne(query);
      console.log('trying to delete', id)
      res.send(result)
    })

    app.delete('/delete-outdoor-service/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: ObjectId(id)}
      const result = await outdoorServiceCollection.deleteOne(query);
      console.log('trying to delete', id)
      res.send(result)
    })

    app.delete('/delete-other-service/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: ObjectId(id)}
      const result = await otherServiceCollection.deleteOne(query);
      console.log('trying to delete', id)
      res.send(result)
    })

      


  
    } finally {

    }
  } run().catch(err => console.error(err));



app.get('/', (req, res)=>{
    res.send('Origin server is running')
})

app.listen(port, ()=> {
    console.log(`origin servrt is runnning on: ${port}`);
})