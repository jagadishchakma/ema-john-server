const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(cors());
app.use(express.json());

//
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = process.env.DB_NAME;
const dbCollection = process.env.DB_COLLECTION;

//
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${user}:${pass}@cluster0.pa04j.mongodb.net/${db}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//

client.connect(err => {
  const productsCollection = client.db(db).collection(dbCollection);
  //
  app.post('/addProduct', (req, res) =>{
    const productMany = req.body;
    productsCollection.insertMany(productMany)
    .then(result => {
        console.log(result.insertedCount);
    })
  });

  //
  app.get('/products', (req, res) => {
    productsCollection.find().limit(80)
    .toArray((err, documents) => {
        res.send(documents);
    })
  });

  //
  app.get('/product/:key', (req, res) => {
      const key = req.params.key;
      productsCollection.find({key: key})
      .toArray((err, documents) => {
          res.send(documents[0]);
      })
  })

  //
  app.post('/products/review', (req, res) => {
      const productKeys = req.body;
      productsCollection.find({key: {$in:[...productKeys]}})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

});


//
app.listen(5000, () => {
    console.log('Server is running on port 5000')
})