const express = require('express')
// const packageName = require('packageName')
const fs = require('fs');
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path')
const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

const folderPath = './uploads';
const UPLOADS_FOLDER = './uploads/'

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function(req, file, cb) {
    const fileExt = path.extname(file.originalname)
    const fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-")+ "-" + Date.now()
    cb(null, fileName + fileExt);
  },
});

const upload = multer({ storage: storage,
limits:{
  fileSize: 2000000,
},
fileFilter:(req, file, cb) => {
  if(file.fieldname === 'image'){
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
      cb(null, true);
    } else{
      cb(new Error('Only jpg, png, jpeg format allowed'))
    }
  }
} });



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ua9xvba.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      const indoorServiceCollection = client.db('origin-db').collection('indoorservices')
      const outdoorServiceCollection = client.db('origin-db').collection('outdoorservices')
      const otherServiceCollection = client.db('origin-db').collection('otherservices')
      const depertments = client.db('origin-db').collection('depertments')
      const doctorsData = client.db('origin-db').collection('doctors')
      const imgData = client.db('origin-db').collection('imgData')


      app.post('/upload',upload.fields([
        {name: 'image', maxCount: 1}
      ]), (req, res) => {
     
        console.log(req.files);
        res.status(200).send(req.files);
      });


      

    app.get('/images/:imageName', (req, res) => {
      const imageName = req.params.imageName;
      const imagePath = `./uploads/${imageName}`;
     
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          res.status(404).send('Image not found');
        } else {
          res.contentType('image/jpeg');
          console.log(data);
          res.send(data);
        }
      });
    });

    app.delete('/images/:imageName', (req, res) => {
      const imageName = req.params.imageName;
      const imagePath = `./uploads/${imageName}`;
      fs.unlink(imagePath, (err) => {
          if (err) {
              return res.status(500).send({ message: 'Error deleting file' })
          }
          res.status(200).send({ message: 'File deleted successfully' })
      })
  })

    app.post('/add-doctor', async(req, res)=>{
      const DoctorInfo = req.body
      console.log(DoctorInfo);
  
      const query ={
         
                    DName: DoctorInfo.DName,
                    Depertment: DoctorInfo.Depertment,
                    Link: DoctorInfo.Link,
                    ImgFile: DoctorInfo.ImgFile
          
      }
      const result = await doctorsData.insertOne(query)
      res.send(result)

  })
    app.post('/img-file', async(req, res)=>{
      const fileInfo = req.body
      
      const result = await imgData.insertOne(fileInfo)
      res.send(result)

  })
      
      

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
      app.post('/depertments', async(req, res)=>{
        const data = req.body
        
    
        const query ={
          depertmentName: data.depertmentName,
          depertmentURL: data.depertmentURL
            
        }
        
        const result = await depertments.insertOne(query)
        res.send(result)

    })

    app.get('/img-file', async(req, res)=>{
      const query ={};
      const cursor = imgData.find(query)
      const result = await cursor.toArray()
      res.send(result);
    })
    app.get('/depertments', async(req, res)=>{
      const query ={};
      const cursor = depertments.find(query)
      const result = await cursor.toArray()
      res.send(result);
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

    app.delete('/delete-imgInfo/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: ObjectId(id)}
      const result = await imgData.deleteOne(query);
      console.log('trying to delete', id)
      res.send(result)
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

    app.delete('/delete-depertments/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: ObjectId(id)}
      const result = await depertments.deleteOne(query);
      
      res.send(result)
    })

      app.use((err, req, res, next)=> {
        if(err){
          if(err instanceof multer.MulterError){
            res.status(500).send('There was an upload error, Please check image size or image format because you can upload jpg, jpeg or png format only and less than 2mb file')
            console.log(err);
          }else{
            res.status(500).send(err.message)
          }
        }else{
          res.send('Success')
        }
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