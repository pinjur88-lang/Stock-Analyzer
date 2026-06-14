import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export const dynamic = "force-dynamic";

// A curated list of 100+ established Canadian companies across various sectors
const TSX_SYMBOLS = [
  'RY.TO', 'TD.TO', 'CNR.TO', 'CP.TO', 'ENB.TO', 'CNQ.TO', 'BMO.TO', 'BNS.TO', 'ATD.TO', 'CSU.TO', 
  'TRI.TO', 'SU.TO', 'BCE.TO', 'CM.TO', 'ITP.TO', 'NTR.TO', 'MFC.TO', 'WCN.TO', 'NA.TO', 'FTS.TO', 
  'SLF.TO', 'PPL.TO', 'WSP.TO', 'AEM.TO', 'IMO.TO', 'CVE.TO', 'T.TO', 'DOL.TO', 'IFC.TO', 'POW.TO', 
  'MRU.TO', 'TRP.TO', 'FCR-UN.TO', 'CAR-UN.TO', 'DIR-UN.TO', 'REI-UN.TO', 'CHP-UN.TO', 'K.TO', 'ABX.TO', 
  'FNV.TO', 'WPM.TO', 'L.TO', 'WN.TO', 'EMO.TO', 'AQN.TO', 'BIP-UN.TO', 'BEP-UN.TO', 'H.TO', 'TIH.TO', 
  'VET.TO', 'WCP.TO', 'TOU.TO', 'ARX.TO', 'CPG.TO', 'MEG.TO', 'BTE.TO', 'HWX.TO', 'TVE.TO', 'ERF.TO', 
  'CJ.TO', 'IPCO.TO', 'SGY.TO', 'MTL.TO', 'DMP.TO', 'LUG.TO', 'FIL.TO', 'NGD.TO', 'BTO.TO', 'CMMC.TO', 
  'CS.TO', 'ERO.TO', 'CG.TO', 'LUN.TO', 'IVN.TO', 'FM.TO', 'HBM.TO', 'TECK-B.TO', 'MAG.TO', 'PAAS.TO', 
  'FR.TO', 'AGI.TO', 'EDV.TO', 'ELD.TO', 'OR.TO', 'KRR.TO', 'SSRM.TO', 'CIGI.TO', 'FSV.TO', 'STN.TO', 
  'SNC.TO', 'ARE.TO', 'WJA.TO', 'AC.TO', 'CHR.TO', 'EIF.TO', 'NFI.TO', 'MAL.TO', 'MRE.TO', 'MG.TO', 
  'LNR.TO', 'BRP.TO', 'DOO.TO', 'GIL.TO', 'ATZ.TO', 'GOOS.TO', 'CTC-A.TO', 'NWX.TO', 'PET.TO', 'EMP-A.TO', 
  'SAP.TO', 'PBH.TO', 'MFI.TO', 'QSR.TO', 'AW-UN.TO', 'MTY.TO', 'PZA.TO', 'GIB-A.TO'
];

const shuffle = (arr: any[]) => arr.sort(() => 0.5 - Math.random());

export async function GET() {
  try {
    const shuffled = shuffle([...TSX_SYMBOLS]);
    
    // Process in batches of 10 to avoid hammering the API and Vercel timeouts.
    // Try up to 4 batches (40 stocks) to find a > 30% undervalued gem.
    let bestStock: any = null;

    for (let batch = 0; batch < 4; batch++) {
      const symbolsToFetch = shuffled.slice(batch * 10, (batch + 1) * 10);
      
      const promises = symbolsToFetch.map(async (symbol) => {
        try {
          const quote = await yahooFinance.quoteSummary(symbol, { modules: ["price", "defaultKeyStatistics"] });
          
          const price = (quote as any).price?.regularMarketPrice;
          const marketCap = (quote as any).price?.marketCap;
          const eps = (quote as any).defaultKeyStatistics?.trailingEps;
          const bvps = (quote as any).defaultKeyStatistics?.bookValue;

          // Missing core metrics
          if (!price || !marketCap || !eps || !bvps) return null;
          
          // Rule 1: Solid company (Assets/Market Cap >= $20,000,000)
          if (marketCap < 20000000) return null;
          
          // Rule 2: Must be profitable and have positive book value to use the Graham formula
          if (eps <= 0 || bvps <= 0) return null;

          // Intrinsic Value (Benjamin Graham Formula for defensive investors)
          // Value = sqrt(22.5 * Earnings Per Share * Book Value Per Share)
          const intrinsicValue = Math.sqrt(22.5 * eps * bvps);
          
          const discountRatio = intrinsicValue / price;

          return { symbol, price, intrinsicValue, discountRatio };
        } catch (e) {
          return null; 
        }
      });

      const results = (await Promise.all(promises)).filter(Boolean) as any[];
      
      // Track the best one we've seen so far globally just in case we don't hit 30%
      results.forEach(r => {
          if (!bestStock || r.discountRatio > bestStock.discountRatio) {
              bestStock = r;
          }
      });

      // Filter for strictly >= 1.30 (30% undervalued)
      const deeplyUndervalued = results.filter(r => r.discountRatio >= 1.30).sort((a, b) => b.discountRatio - a.discountRatio);
      
      if (deeplyUndervalued.length > 0) {
        return NextResponse.json({ 
            success: true, 
            ticker: deeplyUndervalued[0].symbol,
            reason: `Intrinsic Value ($${deeplyUndervalued[0].intrinsicValue.toFixed(2)}) is ${((deeplyUndervalued[0].discountRatio - 1) * 100).toFixed(1)}% higher than the current price ($${deeplyUndervalued[0].price}).`
        });
      }
    }

    // If we scanned 40 stocks and didn't find one that is strictly >30% undervalued, 
    // we return the absolute best one we found in the scan!
    if (bestStock) {
        return NextResponse.json({ 
            success: true, 
            ticker: bestStock.symbol,
            reason: `Best value found in scan. Intrinsic Value ($${bestStock.intrinsicValue.toFixed(2)}) compared to current price ($${bestStock.price}).`
        });
    }

    // Ultimate fallback if APIs fail
    return NextResponse.json({ success: true, ticker: "BNS.TO" });

  } catch (error: any) {
    console.error("Screener Error:", error);
    return NextResponse.json({ error: "Screener failed." }, { status: 500 });
  }
}
