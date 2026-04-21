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

    // 1. Fetch Comprehensive Finance Data
    const results = await (yahooFinance as any).quoteSummary(ticker, {
      modules: ["summaryDetail", "financialData", "defaultKeyStatistics", "assetProfile", "price"]
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
      summary: results.assetProfile?.longBusinessSummary || ""
    };

    // 2. Institutional Research + 20yo Perspective Prompt
    const prompt = `
      Perform an Institutional-Grade Deep Dive Research on the company "${ticker}" (${stats.name}) in the ${stats.sector} sector.
      Current Price: ${stats.currentPrice} ${stats.currency}.
      
      Requirements:
      1. **Intrinsic Value**: Calculate a fair intrinsic value using a simplified DCF (Discounted Cash Flow) based on current margins (${(stats.profitMargins * 100).toFixed(2)}%) and growth (${(stats.revenueGrowth * 100).toFixed(2)}%).
      2. **Finance for 20-Year-Olds**: Explain this company's numbers as if you were talking to a 20-year-old. Use analogies like "Side Hustles," "Credit Scores," "Rent/Subscriptions," "Scaling a Startup," or "Maxing out a Credit Card." Avoid "lemonade stands" or "allowances." Focus on how this business affects their actual lifestyle or how it relates to their hustle.
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
      analysis: deepDive
    });

  } catch (error: any) {
    console.error("Deep Dive Error:", error);
    return NextResponse.json({ error: "Analysis failed. Ensure valid ticker and API keys." }, { status: 500 });
  }
}
