const Tesseract = require("tesseract.js");
const path = require('path');

const verifyAadhaarByOCR = async (imagePath) => {
  try {
    const fullPath = path.join(__dirname, '..', imagePath);
    console.log(`Starting OCR on: ${fullPath}`);
    
    // Tesseract.recognize returns a promise that resolves with the result object
    // Note: ensure 'eng' language data is downloaded or available
    const { data: { text } } = await Tesseract.recognize(fullPath, "eng", {
      logger: m => console.log(`OCR Progress: ${m.status} - ${(m.progress * 100).toFixed(0)}%`)
    });

    const lowerText = text.toLowerCase();
    
    console.log("OCR Extracted Text Preview:", text.substring(0, 100) + "...");

    const result = {
      hasAadhaarWord: lowerText.includes("aadhaar") || lowerText.includes("government of india") || lowerText.includes("uidai"),
      has12DigitNumber: /\d{4}\s\d{4}\s\d{4}/.test(lowerText), // Basic regex for XXXX XXXX XXXX
      hasDOB: lowerText.includes("dob") || lowerText.includes("year of birth") || lowerText.includes("date of birth"),
      rawText: text // Storing raw text just in case (optional, be careful with PII)
    };

    return result;
  } catch (error) {
    console.error("OCR Error:", error);
    // Return false flags if OCR fails so we don't crash, but verification will need manual check
    return {
      hasAadhaarWord: false,
      has12DigitNumber: false,
      hasDOB: false,
      rawText: "OCR Failed: " + error.message
    };
  }
};

module.exports = { verifyAadhaarByOCR };
