import News from "../model/News.js";

console.log("inside dashboard controller")

export const getStats = async (req, res) => {
  try {
    // Fake / Real count
    const fakeCount = await News.countDocuments({ result: "FAKE" });
    const realCount = await News.countDocuments({ result: "REAL" });

    // Avg confidence - OPTIMIZED (don't load all documents)
    const avgConfidenceResult = await News.aggregate([
      { $group: { _id: null, avgConfidence: { $avg: "$confidence" } } }
    ]);
    const avgConfidence = avgConfidenceResult[0]?.avgConfidence || 0;

    // Confidence distribution
    const confidenceDist = {
      high: await News.countDocuments({ confidence: { $gte: 0.8 } }),
      medium: await News.countDocuments({ confidence: { $gte: 0.5, $lt: 0.8 } }),
      low: await News.countDocuments({ confidence: { $lt: 0.5 } })
    };

    // Fake vs Real over time
    const timeline = await News.aggregate([
      {
        $group: {
          _id: { 
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
            result: "$result" 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    // Category breakdown - with null handling
    const categoryBreakdown = await News.aggregate([
      { 
        $group: { 
          _id: { $ifNull: ["$category", "Other"] }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);

    // Fake/Real by category - with null handling
    const fakeRealByCategory = await News.aggregate([
      { 
        $group: { 
          _id: { 
            category: { $ifNull: ["$category", "Other"] }, 
            result: "$result" 
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { "_id.category": 1, "_id.result": 1 } }
    ]);

    // Sources breakdown - with null handling
    const sourcesBreakdown = await News.aggregate([
      { 
        $group: { 
          _id: { $ifNull: ["$source", "Unknown"] }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Recent low confidence (<0.7) - only return necessary fields
    const lowConfidenceNews = await News.find(
      { confidence: { $lt: 0.7 } },
      { text: 1, result: 1, confidence: 1, source: 1, category: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(10);

    // Total count for additional context
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
      lowConfidenceNews
    });

  } catch (err) {
    console.error("getStats error", err);
    res.status(500).json({ 
      error: "Failed to get stats", 
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};