import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

export async function GET() {
  try {
    // Fetch trending symbols for Canada
    const results = await YahooFinance.trendingSymbols("CA");
    
    // Fallback list if API fails to return symbols
    const fallbackSymbols = ["TD.TO", "SHOP.TO", "RY.TO", "SU.TO", "ENB.TO"];
    
    let topSymbol = fallbackSymbols[0];

    if (results && (results as any).quotes && (results as any).quotes.length > 0) {
        // Filter out non-equity/index weirdness if possible, but taking the top one is usually fine.
        const validQuotes = (results as any).quotes.filter((q: any) => q.symbol && !q.symbol.startsWith('^'));
        if (validQuotes.length > 0) {
            topSymbol = validQuotes[0].symbol;
        }
    } else {
        // Pick a random fallback if empty
        topSymbol = fallbackSymbols[Math.floor(Math.random() * fallbackSymbols.length)];
    }

    return NextResponse.json({ ticker: topSymbol });

  } catch (error: any) {
    console.error("Trending fetch error:", error);
    return NextResponse.json({ ticker: "TD.TO" }); // Ultimate safe fallback
  }
}
