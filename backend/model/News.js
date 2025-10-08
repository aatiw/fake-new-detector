import mongoose from "mongoose";

console.log("inside news.js");

const newsSchema = new mongoose.Schema({
    text: {type: String, required: true},
    userSource: {type: String},
    modelResult: {type: String, enum: ['FAKE', 'REAL'], required: true},
    sourceAccuracy : {type: Number, required: true, min: 0, max: 1},
    aiResult: {type: String},
    confidencePercent: {type: String},
    category: { 
      type: String, 
      default: 'Other'
     }, 
    source: {type: String},
    submittedSource: {type: String},
    trend: {type: String},
    context: {type: String},
    aiAnalysis: {type: String},
    similarArticle: [{type:String}],
    rawPredictions: [
      {
        label: { type: String, required: true },
        score: { type: Number, required: true }
      }
    ]
}, {
  timestamps: true
});

newsSchema.index({ modelResult: 1 });
newsSchema.index({ category: 1 });
newsSchema.index({ aiResult: 1 });
newsSchema.index({ submittedSource: 1});
newsSchema.index({ source: 1 });
newsSchema.index({ createdAt: -1 });

export default mongoose.model("News", newsSchema);