export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const countryName = searchParams.get("country");

  if (!countryName) {
    return Response.json({ error: "Missing country parameter" }, { status: 400 });
  }

  // Pre-configured variations of search queries to get fresh, diverse fun facts
  const QUERY_VARIATIONS = [
    `interesting facts about ${countryName}`,
    `fun facts about ${countryName}`,
    `history of ${countryName}`,
    `culture of ${countryName}`,
    `geography of ${countryName}`,
    `landmarks of ${countryName}`,
    `unusual facts about ${countryName}`,
    `little known facts about ${countryName}`,
    `surprising facts about ${countryName}`
  ];

  let finalFact = "";
  let stats = null;

  // 1. Primary: Wikipedia Search API (highly reliable, no rate limits/captchas, dynamic queries)
  try {
    const randomQuery = QUERY_VARIATIONS[Math.floor(Math.random() * QUERY_VARIATIONS.length)];
    const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(randomQuery)}&format=json&origin=*`;

    const response = await fetch(wikiSearchUrl, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      const searchResults = data.query?.search || [];

      if (searchResults.length > 0) {
        // Pick a random result from the 10 search results returned
        const randomResult = searchResults[Math.floor(Math.random() * searchResults.length)];
        let rawSnippet = randomResult.snippet || "";

        // Clean snippet
        let clean = rawSnippet.replace(/<[^>]*>/g, ""); // Strip HTML tags
        clean = clean
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&#x27;/g, "'")
          .replace(/&#x2F;/g, "/")
          .replace(/&nbsp;/g, " ");

        clean = clean.replace(/\s+/g, " ").trim();

        // Clean up ellipses at start or end
        clean = clean.replace(/^\.\.\.\s*/, "").replace(/\s*\.\.\.$/, "");

        if (clean.length > 15) {
          // Capitalize first letter
          clean = clean.charAt(0).toUpperCase() + clean.slice(1);
          
          // Ensure it ends nicely
          if (!clean.endsWith(".") && !clean.endsWith("!") && !clean.endsWith("?")) {
            clean += "...";
          }
          finalFact = clean;
        }
      }
    }
  } catch (error) {
    console.warn("Wikipedia search query failed:", error);
  }

  // 2. Secondary: DuckDuckGo scraper (if Wikipedia search returns nothing)
  if (!finalFact) {
    try {
      const query = `fun fact about ${countryName}`;
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const html = await response.text();
        const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
        const rawSnippets = [];
        let match;

        while ((match = snippetRegex.exec(html)) !== null) {
          if (match[1]) rawSnippets.push(match[1].trim());
        }

        if (rawSnippets.length > 0) {
          const cleanedSnippets = rawSnippets
            .map((raw) => {
              let clean = raw.replace(/<[^>]*>/g, "");
              clean = clean
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&#x27;/g, "'")
                .replace(/&#x2F;/g, "/")
                .replace(/&nbsp;/g, " ");
              clean = clean.replace(/\s+/g, " ").trim();
              const sentenceEndIndex = clean.indexOf(". ");
              if (sentenceEndIndex !== -1) {
                clean = clean.substring(0, sentenceEndIndex + 1);
              } else if (clean.length > 150) {
                clean = clean.substring(0, 147) + "...";
              }
              return clean;
            })
            .filter((snippet) => {
              return (
                snippet.length > 15 &&
                !snippet.toLowerCase().includes("search results") &&
                !snippet.toLowerCase().includes("vending")
              );
            });

          if (cleanedSnippets.length > 0) {
            finalFact = cleanedSnippets[Math.floor(Math.random() * cleanedSnippets.length)];
          }
        }
      }
    } catch (ddgError) {
      console.warn("DuckDuckGo backup scraper failed:", ddgError);
    }
  }

  // 3. Last Resort Fallback: Wikipedia Summary REST API (always returns same summary paragraph)
  if (!finalFact) {
    try {
      let wikiName = countryName;
      if (countryName === "United States") wikiName = "United_States";
      if (countryName === "your local region") wikiName = "Earth";

      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiName)}`;
      const wikiRes = await fetch(wikiUrl, { cache: "no-store" });
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        let extract = wikiData.extract || "";
        extract = extract.replace(/\s+/g, " ").trim();
        const sentenceEndIndex = extract.indexOf(". ");
        if (sentenceEndIndex !== -1) {
          finalFact = extract.substring(0, sentenceEndIndex + 1);
        } else {
          finalFact = extract;
        }
      }
    } catch (wikiErr) {
      console.error("Last resort Wikipedia summary failed:", wikiErr);
    }
  }

  // Absolute fallback in case everything fails
  if (!finalFact) {
    finalFact = "This country has a unique story and rich cultural heritage waiting to be explored!";
  }

  // 4. Fetch stats server-side (resolves client CORS issues)
  try {
    const queryName = countryName === "your local region" ? "India" : countryName;
    const restUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(queryName)}?fullText=true`;
    const restRes = await fetch(restUrl, { cache: "no-store" });
    if (restRes.ok) {
      const restData = await restRes.json();
      const country = restData[0];
      if (country) {
        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population ? country.population.toLocaleString() : "N/A";
        const currencies = country.currencies 
          ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(", ") 
          : "N/A";
        const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
        stats = { capital, population, currencies, languages };
      }
    }
  } catch (restErr) {
    console.warn("Rest Countries API failed server-side:", restErr);
  }

  return Response.json({ fact: finalFact, stats });
}
