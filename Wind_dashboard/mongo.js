require('dotenv').config();

const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false
    });
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
  
  return mongoose;
};

mongoose.connection.on("error", (error) => {
  console.error("Database connection error:", error);
});
