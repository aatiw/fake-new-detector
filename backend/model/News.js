import mongoose from "mongoose";

console.log("inside news.js");

const newsSchema = new mongoose.Schema({
    text: {type: String, required: true},
    result: {type: String, enum: ['FAKE', 'REAL'], required: true},
    confidence : {type: Number, required: true, min: 0, max: 1},
    source: {type: String},
    userSource: {type: String},       
    sourceAccuracy: {type: Boolean} ,
    category: { 
      type: String, 
      enum: ['Politics', 'Health', 'Sports', 'Tech', 'Finance', 'Entertainment', 'Other'],
      default: 'Other'
     }, 
    rawPredictions: [
      {
        label: { type: String, required: true },
        score: { type: Number, required: true }
      }
    ]
}, {
  timestamps: true
});

newsSchema.index({ result: 1 });
newsSchema.index({ category: 1 });
newsSchema.index({ confidence: 1 });
newsSchema.index({ createdAt: -1 });

export default mongoose.model("News", newsSchema);