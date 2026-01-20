const Pdf = require("../models/uploadpdf.model");

const uploadPdf = async (req, res) => {
  try {
    const { pdftitle } = req.body;
    let pdfBase64 = null;
    if (req.file) {
      pdfBase64 = req.file.buffer.toString("base64");
    }
    const createPdf = new Pdf({
        pdftitle,
        pdffile:pdfBase64
    })
    await createPdf.save();
     res.status(201).json({
      success: true,
      message: "PDF uploaded successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPdf = async (req,res) => {
  try {
    const allPdf = await Pdf.find().sort({ createdAt: -1 });;

    res.status(200).json({
      success: true,
      data: allPdf,
      length:allPdf.length
    });
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}

const updatePdf = async (req,res) => {
  try {
    const id = req.params.id
    const {pdftitle} = req.body
    if(!id){
      res.status(404).json({
        message:"Pdf id not found!"
      })
    }
    const updateData = {pdftitle}
    if(req.file){
      updateData.pdffile = req.file.buffer.toString("base64");
    }
    await Pdf.findByIdAndUpdate(id,updateData,{new:true})
    res.status(200).json({
      success:true,
      message:"Pdf updated successfully!"
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}

const deletePdf = async (req,res) =>{
  try {
    const id = req.params.id
    if(!id){
      res.status(404).json({
        message:"Pdf id not found"
      })
    }
    await Pdf.findByIdAndDelete(id)
    res.status(200).json({
      success:true,
      message:"Pdf deleted successfully!"
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}

module.exports = {uploadPdf,getPdf,updatePdf,deletePdf };
