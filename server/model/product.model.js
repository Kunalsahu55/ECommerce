
const mongoose = require("mongoose")

const productSchema= mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    url:{

    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},{timestamps:true}
)

module.exports = mongoose.model('Product',productSchema)