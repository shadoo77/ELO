//Import the mongoose module
var mongoose = require("mongoose");

//Set up default mongoose connection
var mongoDB =
  "mongodb+srv://mark:test@alfa-znv2l.mongodb.net/test6?retryWrites=true";
mongoose.connect(mongoDB, {
  useNewUrlParser: true
});

mongoose.set("debug", false);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);

// FindOneAndModify is deprecated, but keeps breaking stuff
mongoose.set("useFindAndModify", false);

//Get the default connections
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", console.error.bind(console, "MongoDB connected.."));
db.on("disconnected", console.error.bind(console, "MongoDB disconnected.."));

async function dropDB() {
  await db.dropDatabase();
}

async function deleteCollection(collectionName) {
  try {
    await db.collection(collectionName).drop();
  } catch (err) {
    if (err.code === 26) {
      console.log(
        "Collection not found : ",
        db.collection(collectionName).name
      );
      //throw err;
    } else {
      throw err;
    }
  }
}

module.exports = {
  dropDB,
  deleteCollection
};
