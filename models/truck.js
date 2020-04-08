const mongoose = require("mongoose");
const Schema= mongoose.Schema

const TruckSchema = new Schema({

    type:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    created_by:{
        type:String,
        required:true
    },
    assigned_to:{
        type:String
    },
    payload:{
        type:Number,
        required:true
    },
    dimension:{
        type:Object,
        required:true
    }

})

module.exports= mongoose.model('Truck',TruckSchema)