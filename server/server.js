const express = require("express")
const dotenv = require("dotenv")
const cors =require("cors")
const mongoose = require("mongoose")
const authRouter = require("./routes/auth.rout")
const productRouter = require("./routes/product.rout")
const bookingRouter =require('./routes/booking.rout')
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 5000
const MONGO_URL= process.env.MONGO_URI

//Router
app.use("/api/auth",authRouter)
app.use('/api/products',productRouter)
app.use('/api/bookings',bookingRouter)
app.listen(PORT,()=>{
    console.log(`Your server is run at ${PORT}`);
    
})

mongoose.connect(MONGO_URL).then(() => {
    console.log("🟢DB Connected successfully");
    
}).catch((err) => {
    console.log("🔴Disconnected DB:",err);
    
});
