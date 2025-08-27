import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    text: {type: String, required: true},
    result: {type: String, enum: ['FAKE', 'REAL'], required: true},
    confidence : {typeof: Number, required: true},
    source: {type: String},
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model("News", newsSchema);