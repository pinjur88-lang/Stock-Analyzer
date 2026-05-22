import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function POST(request: Request) {
  try {
    const { ticker } = await request.json();

    if (!ticker) {
      return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";

    // 1. Fetch Comprehensive Finance Data including Analysts and Insiders
    const results = await (yahooFinance as any).quoteSummary(ticker, {
      modules: [
        "summaryDetail", 
        "financialData", 
        "defaultKeyStatistics", 
        "assetProfile", 
        "price",
        "recommendationTrend",
        "insiderTransactions"
      ]
    });

    const stats = {
      name: results.price?.longName || ticker,
      currentPrice: results.financialData?.currentPrice || 0,
      currency: results.price?.currency || "CAD",
      debtToEquity: results.financialData?.debtToEquity || "N/A",
      peRatio: results.summaryDetail?.trailingPE || results.summaryDetail?.forwardPE || "N/A",
      dividendYield: results.summaryDetail?.dividendYield ? `${(results.summaryDetail.dividendYield * 100).toFixed(2)}%` : "N/A",
      marketCap: results.summaryDetail?.marketCap ? `$${(results.summaryDetail.marketCap / 1e9).toFixed(2)}B` : "N/A",
      sector: results.assetProfile?.sector || "Unknown",
      profitMargins: results.financialData?.profitMargins || 0,
      revenueGrowth: results.financialData?.revenueGrowth || 0,
      returnOnEquity: results.financialData?.returnOnEquity || 0,
      summary: results.assetProfile?.longBusinessSummary || "",
      recommendation: results.financialData?.recommendationKey || "none",
      targetMeanPrice: results.financialData?.targetMeanPrice || null,
      recommendationTrend: results.recommendationTrend?.trend?.[0] || null, // Current month's trend
      insiderTransactions: results.insiderTransactions?.transactions?.slice(0, 5) || [] // Last 5 insider trades
    };

    // 2. Institutional Research + 20yo Perspective Prompt
    const prompt = `
      Perform an Institutional-Grade Deep Dive Research on the company "${ticker}" (${stats.name}) in the ${stats.sector} sector.
      Current Price: ${stats.currentPrice} ${stats.currency}.
      
      Requirements:
      1. **Intrinsic Value**: Calculate a fair intrinsic value using a simplified DCF (Discounted Cash Flow) based on current margins (${(stats.profitMargins * 100).toFixed(2)}%) and growth (${(stats.revenueGrowth * 100).toFixed(2)}%).
      2. **The ELI5 Breakdown (Simple Terms)**: Explain this company to someone who is entirely financially illiterate or very young. You MUST answer these two things in simple terms: 1) What exactly does this company produce or do? 2) Where does their major cash flow actually come from (how do they make money)? Use relatable analogies like "Side Hustles," "Subscriptions," or "Selling picks and shovels." Focus on how their business model actually functions in the real world without using jargon.
      3. **Sector Dynamics**: Dynamics, headwinds, tailwinds, and shifts.
      4. **Management Assessment**: Capability and trustworthiness scores.
      5. **Price Targets**: Method-based 12-month projections.
      6. **Analyst Debate**: Super Bull vs. Super Bear.

      Output as JSON:
      {
        "intrinsicValue": { "value": number, "logic": string },
        "twentyYearOldView": string,
        "introduction": string,
        "sectorDynamics": { "isCyclical": boolean, "headwinds": string, "tailwinds": string, "majorShifts": string },
        "managementAudit": { "turnaroundPlan": string, "trustworthiness": string, "capabilityScore": string },
        "thesis": { "path": string, "timeHorizon": string, "hiddenRisks": string },
        "priceTargets": [ { "method": string, "target": number, "logic": string } ],
        "alternatives": [ { "ticker": string, "reason": string } ],
        "debate": { "bull": string, "bear": string, "observer": string }
      }
    `;

    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const aiResult = await aiResponse.json();
    if (!aiResponse.ok) throw new Error("Gemini API error");

    const deepDive = JSON.parse(aiResult.candidates?.[0]?.content?.parts?.[0]?.text || "{}");

    // Format Insider Transactions for UI
    const formattedInsiders = stats.insiderTransactions.map((trade: any) => {
      let simpleExplanation = "They moved shares around.";
      const text = (trade.transactionText || "").toLowerCase();
      
      if (text.includes("public market") && text.includes("acquisition")) {
        simpleExplanation = "They used their own personal cash to buy shares on the open market. This is a strong sign they believe the stock will go up!";
      } else if (text.includes("public market") && text.includes("sale")) {
        simpleExplanation = "They sold their shares for cash on the open market. They might be taking profits or just need cash.";
      } else if (text.includes("option") && text.includes("exercise")) {
        simpleExplanation = "They used a company perk to buy shares at a huge discount.";
      } else if (text.includes("grant") || text.includes("award")) {
        simpleExplanation = "The company gifted them free shares as a performance bonus or salary.";
      } else if (text.includes("automatic")) {
        simpleExplanation = "This was a pre-scheduled, automated trade. It happens automatically on a specific date.";
      } else if (text.includes("disposition") || text.includes("tax")) {
        simpleExplanation = "They gave up or sold shares, usually just to cover the taxes they owe on a stock bonus.";
      }

      let formattedDate = "Unknown Date";
      if (trade.startDate) {
        // Just slice the string or parse date safely
        const d = new Date(trade.startDate);
        if (!isNaN(d.getTime())) {
          formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
        }
      }

      return {
        filerName: trade.filerName,
        transactionText: trade.transactionText,
        shares: trade.shares,
        value: trade.value,
        date: formattedDate,
        simpleExplanation
      };
    });

    return NextResponse.json({
      ticker: ticker.toUpperCase(),
      name: stats.name,
      currency: stats.currency,
      currentPrice: stats.currentPrice,
      financials: {
        debtToEquity: stats.debtToEquity,
        peRatio: typeof stats.peRatio === 'number' ? stats.peRatio.toFixed(2) : stats.peRatio,
        dividendYield: stats.dividendYield,
        marketCap: stats.marketCap,
        revenueGrowth: `${(stats.revenueGrowth * 100).toFixed(2)}%`,
        profitMargins: `${(stats.profitMargins * 100).toFixed(2)}%`
      },
      marketSentiment: {
        recommendation: stats.recommendation,
        targetMeanPrice: stats.targetMeanPrice,
        trend: stats.recommendationTrend
      },
      insiderTrades: formattedInsiders,
      analysis: deepDive
    });

  } catch (error: any) {
    console.error("Deep Dive Error:", error);
    return NextResponse.json({ error: "Analysis failed. Ensure valid ticker and API keys." }, { status: 500 });
  }
}
