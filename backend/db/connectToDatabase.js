import mongoose, { connect } from "mongoose"

const connectToDatabase=async ()=>{
try {
    await mongoose.connect(process.env.MONGO_DB_URI)  
    console.log('connected to db')  
} catch (error) {
    console.log('error occured',error)
}
}

export default connectToDatabase;