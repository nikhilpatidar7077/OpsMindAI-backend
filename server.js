const express = require("express");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3200;
const connectDB = require("./config/db");
const userRouter = require("./routes/user.routes");
const adminRouter = require("./routes/admin.routes");

// Week 1 AI Dependencies
const multer = require("multer");
const pdf = require("pdf-parse");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters"); // FIXED IMPORT
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const { OpenAIEmbeddings } = require("@langchain/openai");
const mongoose = require("mongoose");

connectDB();

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// Multer Setup
const upload = multer({ storage: multer.memoryStorage() });

/**
 * WEEK 1: Knowledge Ingestion
 * Task: Extract text from SOP PDF, chunk it, and save to Vector DB
 */
app.post("/api/sop/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        // 1. Extract Text
        const data = await pdf(req.file.buffer);
        
        // 2. Chunking (1000 chars, 100 overlap as per project doc)
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100,
        });
        const docs = await splitter.createDocuments([data.text]);

        // 3. Store in MongoDB Vector Store
        const collection = mongoose.connection.db.collection("sop_embeddings");
        await MongoDBAtlasVectorSearch.fromDocuments(
            docs,
            new OpenAIEmbeddings(), // Needs OPENAI_API_KEY in .env
            {
                collection: collection,
                indexName: "vector_index", 
                textKey: "text",
                embeddingKey: "embedding",
            }
        );

        res.status(200).json({ message: "SOP indexed!", chunks: docs.length });
    } catch (error) {
        console.error("Week 1 Error:", error);
        res.status(500).json({ error: "Failed to process SOP" });
    }
});

app.get("/", (req, res) => {
    res.send("OpsMind AI Server is running!");
});

app.listen(PORT, () => {
    console.log(`server runs on PORT - ${PORT}`);
});