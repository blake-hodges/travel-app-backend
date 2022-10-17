const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
const { MongoClient, ConnectionClosedEvent } = require('mongodb');


const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PW;


const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.0fhve.mongodb.net/sample_airbnb?retryWrites=true&w=majority`;


MongoClient.connect(url)
.then(client => {
    console.log('connected to database');
    const db = client.db('sample_airbnb');


    app.get("/destinations", (req, res) => {
        let country = req.query.country;
        let market = req.query.market;
        console.log(country, market);
        let query;

        if (market === "All") {
            query = { "address.country" : country }
        } else {
            query = { "address.country" : country, "address.market" : market }
        }
        db.collection("listingsAndReviews").find(query).limit(20).toArray()
            .then(results => {
                res.json(results);
            })  
            .catch(error => console.error(error))
    })


    app.get("/data", (req, res) => {
        
        res.send(JSON.stringify(dbFile));
    });

    app.post("/book", (req, res) => {
        console.log(req.body);
        db.collection("bookings").insertOne(req.body)
        .then(result => {
                console.log(result);
                res.send("great success")
        })
        .catch(error => {
            console.error(error)
            res.send("server error");
        })
    });
    app.post("/contact-form", (req, res) => {
        console.log(req.body);
        db.collection("contact").insertOne(req.body)
        .then(result => {
                console.log(result);
                res.send("great success")
        })
        .catch(error => {
            console.error(error)
            res.send("server error");
        })
    });



})
    


app.listen(8080, () => {
    console.log("server started on port 8080");
})

const cleanup = (event) => {
    MongoClient.close();
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);