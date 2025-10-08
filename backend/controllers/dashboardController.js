import News from "../model/News.js";

console.log("inside dashboard controller")

export const getStats = async (req, res) => {
  try {
    const fakeCount = await News.countDocuments(
      { aiResult: {$regex : /fake/i }}
    );
    const realCount = await News.countDocuments({
      aiResult: {$regex : /real/i}
    });


    const avgConfidenceResult = await News.aggregate([
      { $group: { _id: null, avgConfidence: { $avg: "$sourceAccuracy" } } }
    ]);
    const avgConfidence = avgConfidenceResult[0]?.avgConfidence || 0;


    const confidenceDist = {
      high: await News.countDocuments({ sourceAccuracy: { $gte: 0.8 } }),
      medium: await News.countDocuments({ sourceAccuracy: { $gte: 0.5, $lt: 0.8 } }),
      low: await News.countDocuments({ sourceAccuracy: { $lt: 0.5 } })
    };


    const timeline = await News.aggregate([
      {
        $group: {
          _id: { 
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
            result: "$modelResult" 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);


    const categoryBreakdown = await News.aggregate([
      { 
        $group: { 
          _id: { $ifNull: ["$category", "Other"] }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);


    const fakeRealByCategory = await News.aggregate([
      {
        $addFields: {
          normalizedResult: {
            $switch: {
              branches: [
                { case: { $in: ["$aiResult", ["FAKE", "LIKELY FAKE"]] }, then: "fake" },
                { case: { $in: ["$aiResult", ["REAL", "LIKELY REAL"]] }, then: "real" }
              ],
              default: "unknown" 
            }
          }
        }
      },
      {
      $group: {
        _id: { 
          category: { $ifNull: ["$category", "Other"] },
          result: "$normalizedResult"
        },
        count: { $sum: 1 }
      }
      },
      { $sort: { "_id.category": 1, "_id.result": 1 } }
    ]);


    const sourcesBreakdown = await News.aggregate([
      { 
        $group: { 
          _id: { $ifNull: ["$submittedSource", "Unknown"] }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);


    const totalCount = fakeCount + realCount;

    res.json({
      summary: {
        totalCount,
        fakeCount,
        realCount,
        fakePercentage: totalCount > 0 ? ((fakeCount / totalCount) * 100).toFixed(1) : 0,
        avgConfidence: Number(avgConfidence.toFixed(3))
      },
      confidenceDist,
      timeline,
      categoryBreakdown,
      fakeRealByCategory,
      sourcesBreakdown,
    });

  } catch (err) {
    console.error("getStats error", err);
    res.status(500).json({ 
      error: "Failed to get stats", 
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};