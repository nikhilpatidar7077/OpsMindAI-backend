const express = require("express");
const { uploadPdf, getPdf, updatePdf, deletePdf, getAllUsers } = require("../controllers/admin.controller");
const jwtAuthMiddleware = require("../middleware/jwtauth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const upload = require("../middleware/uploadpdf.middleware");
const router = express.Router();

// router.post("/login",adminLogin);
router.get("/users",jwtAuthMiddleware,adminMiddleware,getAllUsers);
router.post("/uploadpdf",jwtAuthMiddleware,adminMiddleware,upload.single("pdffile"),uploadPdf);
router.get("/pdf",jwtAuthMiddleware,adminMiddleware,getPdf);
router.put("/updatepdf/:id",jwtAuthMiddleware,adminMiddleware,upload.single("pdffile"),updatePdf);
router.delete("/deletepdf/:id",jwtAuthMiddleware,adminMiddleware,deletePdf)

module.exports = router;