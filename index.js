const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId,  } = require('mongodb');

// middlware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wfqwiph.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const postCardCollection = client.db('joyTweet').collection('postCards');
        const userInfoCollection = client.db('joyTweet').collection('userInfo');

        app.post('/postCards', async(req, res)=>{
            const postCardDetails= req.body;
            const result= await postCardCollection.insertOne(postCardDetails);
            res.send(result)
        })
        
        
        app.get('/postscard', async(req,res)=>{
            const query ={}
            const cursor =postCardCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/userinfo/:email', async(req,res)=>{
            const email=req.params.email
            const query ={email: email}
            const cursor =userInfoCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/mypost/:email', async(req,res)=>{
            const email =req.params.email
            const query ={ userEmail: email }
            const cursor =postCardCollection.find(query);
            const mypost = await cursor.toArray();
            res.send(mypost);
        })

        app.put('/reactupdate/:id', async(req, res)=>{
            const Id= req.params.id;
            const filter ={ _id: new ObjectId(Id) };
            const count =req.body.reactCount
            const react =req.body.react
            const uid =req.body.uid
            const option = {upsert: true};
            const updatedDoc = {
                $set: {
                     reactCount: count,
                     react:react,
                     uid:uid,
                }
                
            }
            const result= await postCardCollection.updateOne(filter, updatedDoc, option);
            res.send(result)
         })
         app.delete('/deletepost/:id', async(req,res)=>{
            const id =req.params.id;
            const query ={ _id: new ObjectId(id) };
            const result=await postCardCollection.deleteOne(query);
            res.send(result);
        })
        app.post('/userinfo', async(req, res)=>{
            const userinfo= req.body;
            const result= await userInfoCollection.insertOne(userinfo);
            res.send(result)
        })
        

    }
    finally{
        

    }
}
run().catch(err => console.error(err));

app.get('/',(req,res)=>{
    res.send('server running....')
});

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})