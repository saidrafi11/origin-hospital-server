const express = require('express')
// const packageName = require('packageName')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://origin-db:bizoWWfi4KHLQSh8@cluster0.ua9xvba.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      const indoorServiceCollection = client.db('origin-db').collection('indoorservices')
      const outdoorServiceCollection = client.db('origin-db').collection('outdoorservices')
      const otherServiceCollection = client.db('origin-db').collection('otherservices')

      // app.post('indoor-services', (req, res) => {
      //   const compleatedTasks = req.body;
      //   const result = allComment.insertOne(compleatedTasks);
      //   res.send(result)
      // })

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
      

      


  
    } finally {

    }
  } run().catch(err => console.error(err));



app.get('/', (req, res)=>{
    res.send('Origin server is running')
})

app.listen(port, ()=> {
    console.log(`origin servrt is runnning on: ${port}`);
})