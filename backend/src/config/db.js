import mongoose from "mongoose";
const connectdb=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected:${conn.connection.host}`);
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
};
export default connectdb;