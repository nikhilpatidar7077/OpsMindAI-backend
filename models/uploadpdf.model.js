const {Schema,model} = require("mongoose");

const pdfSchema = new Schema({
    pdftitle:{
        type:String,
        required:true
    },
    pdffile:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const pdfModel = model("pdf",pdfSchema)

module.exports = pdfModel