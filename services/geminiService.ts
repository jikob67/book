
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { MOCK_USER } from "../constants";

let chatSession: Chat | null = null;

// Ensure new instance per block to guarantee up-to-date API keys
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const initializeChat = async () => {
    const ai = getAI();

    try {
        chatSession = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: `You are the specialized AI assistant for 'book'. 
                User Info: Name: ${MOCK_USER.fullName}, Tier: ${MOCK_USER.subscriptionTier}.
                
                Tier-Specific Handling:
                - Enterprise: Offer dedicated human-support escalation if needed. Emphasize their 0% commission advantage.
                - Pro: Discuss advanced market analytics and social promo strategies.
                - Basic/Newbie: Encourage upgrading for better visibility and lower limits.
                
                Platform Features:
                1. Book Types: Paper (15% comm), E-book (10% comm), Audio (5% comm).
                2. Enterprise Perk: 0% Platform Commission.
                3. Market DNA: Pro users get a special stats page.
                
                Always answer in the user's language. Refer technical queries to jikob67@gmail.com.`,
            },
        });
        return chatSession;
    } catch (error) {
        console.error("Failed to initialize chat", error);
        return null;
    }
};

export const sendMessageToAI = async (message: string): Promise<string> => {
    if (!chatSession) await initializeChat();
    if (!chatSession) return "Service temporarily unavailable.";

    try {
        const response = await chatSession.sendMessage({ message: message });
        // Use .text property directly as per SDK requirements
        return response.text || "Could you repeat that?";
    } catch (error) {
        return "I'm having trouble connecting. Please try again later.";
    }
};

/**
 * book Guard AI: Ultra-strict community safety moderator with penalty logic
 */
export const moderateListingContent = async (listingData: { title: string, type: string }): Promise<{ isAllowed: boolean; reason: string; severity: 'low' | 'high' }> => {
    const ai = getAI();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Act as an UNCOMPROMISING community safety moderator for the 'book' marketplace. 
            Analyze the following listing:
            Title: "${listingData.title}"
            Category/Type: "${listingData.type}"

            Strict Rejection Criteria:
            1. Unethical content (promotion of immoral acts, illegal activities).
            2. Harmful to society (hate speech, radicalism, promotion of violence, dangerous misinformation).
            3. Sexual content (any erotic or sexually explicit themes).
            4. Fraudulent or deceptive titles.
            5. Content violating human dignity or promoting discrimination.

            If the content is even SLIGHTLY questionable regarding social safety, REJECT IT.`,
            config: {
                responseMimeType: "application/json",
                // SDK requirement: Use Type and structured properties for schema
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    isAllowed: { type: Type.BOOLEAN },
                    reason: { type: Type.STRING, description: "Detailed explanation in Arabic for why it was rejected" },
                    severity: { type: Type.STRING, enum: ["low", "high"] }
                  },
                  required: ["isAllowed", "reason", "severity"]
                }
            }
        });

        // Use .text property directly
        const result = JSON.parse(response.text || '{"isAllowed": true, "reason": "", "severity": "low"}');
        return result;
    } catch (error) {
        console.error("Moderation error:", error);
        return { isAllowed: false, reason: "عذراً، فشل نظام الفحص الأمني. يرجى المحاولة لاحقاً.", severity: 'low' }; 
    }
};

/**
 * AI Listing Corrector: Suggests ethical alternatives for rejected listings
 */
export const suggestCorrectedListing = async (listingData: { title: string, reason: string }): Promise<{ suggestedTitle: string }> => {
    const ai = getAI();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `The following book listing was REJECTED for this reason: "${listingData.reason}".
            Original Title: "${listingData.title}".
            
            Your task: Suggest a new, ETHICAL, and SAFE title that fulfills the user's intent without violating community standards. 
            If the title was about hate or porn, suggest something educational or neutral instead.`,
            config: {
                responseMimeType: "application/json",
                // SDK requirement: Use Type for schema configuration
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    suggestedTitle: { type: Type.STRING, description: "The new safe title in Arabic" }
                  },
                  required: ["suggestedTitle"]
                }
            }
        });

        // Use .text property directly
        const result = JSON.parse(response.text || `{"suggestedTitle": "${listingData.title}"}`);
        return result;
    } catch (error) {
        return { suggestedTitle: listingData.title };
    }
};
