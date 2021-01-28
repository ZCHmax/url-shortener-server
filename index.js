const express = require("express");
const body_parser = require("body-parser");
const cors = require('cors')
const validUrl = require('valid-url');
const shortid = require('shortid');
const MongoClient = require("mongodb").MongoClient;


const dbConnectionUrl = "mongodb+srv://MaxZhang:000000000@cluster0.qxfte.mongodb.net/url_shortener?retryWrites=true&w=majority";
const connectOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true, 
}; 
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
};


const server = express();
server.use(body_parser.json());
server.use(cors(corsOptions));


server.post("/url", async(request, response) => {
    const { shortBaseUrl, originalUrl } = request.body;
    const createdAt = new Date();
    const queryOptions = { originalUrl };

    if (validUrl.isUri(originalUrl)) {
        urlData = await collection.find(queryOptions).toArray();
        if (urlData.length != 0) {
            response.status(200).json(urlData[0]);
        } else {
            const urlCode = shortid.generate();
            shortUrl = shortBaseUrl + '/' + urlCode;
            const itemToBeSaved = { originalUrl, shortUrl, urlCode, createdAt };

            // Add the item to db
            collection.insertOne(itemToBeSaved, (error, result) => { // callback of insertOne
                if (error) throw error;
                response.status(200).json(itemToBeSaved);
            })
        }
    }
})

const port = 7000;
server.listen(port, () => {
    console.log(`Server listening at ${port}`);
    // << db setup >>
    const dbName = "rethink";
    const collectionName = "short_url";
    MongoClient.connect(dbConnectionUrl, connectOptions, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(dbName);
        collection = database.collection(collectionName);
        console.log("Connected to Database`" + collectionName + "`!");

        // collection.find().toArray(function(err, result) {
        //     if (err) throw err;
        //     console.log(result);
        // });
    });
});