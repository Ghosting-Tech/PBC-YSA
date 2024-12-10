function formatLargeNumber(num, decimalPlaces = 1) {
  // Handle edge cases
  if (num === null || num === undefined) return "";
  if (num < 1000) return num.toString();

  // Define abbreviation thresholds
  const abbreviations = [
    { threshold: 1_000_000_000, abbr: "B" },
    { threshold: 1_000_000, abbr: "M" },
    { threshold: 1_000, abbr: "K" },
  ];

  // Find the appropriate abbreviation
  for (let abbr of abbreviations) {
    if (num >= abbr.threshold) {
      const formattedNum = (num / abbr.threshold).toFixed(decimalPlaces);
      return `${formattedNum}${abbr.abbr}`;
    }
  }

  return num.toString();
}

export default formatLargeNumber;
