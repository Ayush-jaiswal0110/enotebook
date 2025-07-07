const mongoose = require("mongoose");
const mongoose_URI = "mongodb+srv://ayush:Pranjal%403105@cluster0.6amg2no.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//mongodb+srv://ayush:Pranjal%403105@cluster0.6amg2no.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoose_URI);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;

