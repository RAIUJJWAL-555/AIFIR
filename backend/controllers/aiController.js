const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require("express-async-handler");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const classifyComplaint = async (text) => {
  const prompt = `
You are an AI assistant for the Indian Police FIR system.
Your task is to classify citizen complaints accurately, even if they are in English, Hindi, or Hinglish (Hindi written in English script).

Map the complaint to exactly ONE of the following 'crime_type' values:
- "Theft" (Includes chori, stolen items, pickpocketing)
- "Cyber Crime" (Includes online fraud, hacking, fake profiles)
- "Harassment" (Includes stalking, abuse, pichha karna)
- "Lost Property" (Includes gum ho gaya, kho gaya)
- "Fraud" (Includes dhokhadhadi, scam, cheating)
- "Robbery" (Includes loot, snatching)
- "Assault" (Includes maar-peet, physical attack)
- "Other" (Anything else)

Also determine 'severity': Low, Medium, or High.

Return ONLY valid JSON.
Example Output: {"crime_type": "Theft", "severity": "Medium"}

Complaint:
"${text}"
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    console.log("Gemini Raw Response:", textResponse);

    // Robust JSON extraction
    const startIndex = textResponse.indexOf('{');
    const endIndex = textResponse.lastIndexOf('}');

    if (startIndex === -1 || endIndex === -1) {
        throw new Error("Invalid JSON response from AI");
    }

    const jsonStr = textResponse.substring(startIndex, endIndex + 1);
    const parsedData = JSON.parse(jsonStr);

    console.log("Parsed AI Data:", parsedData);
    return parsedData;

  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Return a valid fallback structure
    return { crime_type: "Other", severity: "Medium" }; 
  }
};

// Rule-based Keyword Definitions
const KEYWORDS = {
    "Theft": ["chori", "stolen", "theft", "loot", "looted", "snatch", "mobile chori", "bag chori", "bike chori", "wallet chori", "phone chori", "pickpocket", "missing"],
    "Cyber Crime": ["otp", "hacked", "bank fraud", "phishing", "fake profile", "online scam", "cyber", "internet fraud", "upi fraud", "katha se paise"],
    "Harassment": ["harass", "stalking", "abuse", "follow", "pichha", "badtamizi", "molest", "eve teasing"],
    "Lost Property": ["lost", "gum", "kho gaya", "missing", "gir gaya", "wallet lost", "phone lost", "document lost"],
    "Assault": ["beat", "mara", "fight", "attack", "hit", "maar-peet", "injury", "khoon"],
    "Robbery": ["robbery", "dacoity", "gunpoint", "knife", "threat"],
};

const detectByRules = (text) => {
    const lower = text.toLowerCase();
    
    // Check keyword matches
    for (const [type, words] of Object.entries(KEYWORDS)) {
        for (const word of words) {
            if (lower.includes(word)) {
                return {
                    crime_type: type,
                    severity: "Medium", // Default severity for rule matches
                    method: "rule-based"
                };
            }
        }
    }
    return null;
};

// @desc    Analyze complaint description
// @route   POST /api/ai/classify
// @access  Private
const analyzeComplaintParams = asyncHandler(async (req, res) => {
  const { description } = req.body;

  if (!description) {
    res.status(400);
    throw new Error("Please provide a description");
  }

  // 1️⃣ Rule-based Classification First (Fast & Deterministic)
  const ruleResult = detectByRules(description);
  
  if (ruleResult) {
      console.log(`Rule Matched: ${ruleResult.crime_type}`);
      return res.status(200).json({
          success: true,
          ai: ruleResult
      });
  }

  // 2️⃣ AI Fallback
  console.log("No rule matched, calling Gemini AI...");
  const aiResult = await classifyComplaint(description);

  res.status(200).json({
    success: true,
    ai: { ...aiResult, method: "ai-based" }
  });
});

module.exports = { analyzeComplaintParams };
