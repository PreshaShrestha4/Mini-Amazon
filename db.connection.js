import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const url =
      "mongodb+srv://iims:iims123@mernstack.4tkmv.mongodb.net/mini-amazon?retryWrites=true&w=majority&appName=mernstack";
    await mongoose.connect(url);

    console.log("DB connection successful....");
  } catch (error) {
    console.log("DBconnection failed");
    console.log(error.message);
  }
};

export default dbConnect;