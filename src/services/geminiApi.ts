
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface ImageAnalysisResult {
  wasteType: string;
  classification: string;
  recommendations: string;
  recyclingTips: string;
}

export class GeminiApiService {
  private static readonly API_KEY = 'AIzaSyDrZEogRkINfN1ow8T8whhU-_5Wr5AryGs';
  private static readonly BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

  static async analyzeWasteImage(imageBase64: string): Promise<ImageAnalysisResult> {
    const prompt = `
      Analyze this waste/plastic image and provide:
      1. Main waste type (plastic, metal, glass, organic, electronic, etc.)
      2. Specific classification (PET bottle, HDPE container, aluminum can, etc.)
      3. Recycling recommendations
      4. Environmental impact tips
      
      Format your response as JSON with keys: wasteType, classification, recommendations, recyclingTips
    `;

    try {
      const response = await fetch(`${this.BASE_URL}/gemini-1.5-flash:generateContent?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }]
        })
      });

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        const text = data.candidates[0].content.parts[0].text;
        
        // Try to parse JSON response
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.warn('Failed to parse JSON, using fallback parsing');
        }
        
        // Fallback parsing
        return {
          wasteType: this.extractInfo(text, 'waste type', 'plastic'),
          classification: this.extractInfo(text, 'classification', 'recyclable plastic'),
          recommendations: this.extractInfo(text, 'recommendation', 'Clean and sort before recycling'),
          recyclingTips: this.extractInfo(text, 'tip', 'Check local recycling guidelines')
        };
      }
      
      throw new Error('No response from Gemini API');
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback analysis
      return {
        wasteType: 'plastic',
        classification: 'recyclable material',
        recommendations: 'Clean the item and check local recycling guidelines',
        recyclingTips: 'Proper sorting helps create a circular economy'
      };
    }
  }

  static async generateChatResponse(message: string, context?: string): Promise<string> {
    const systemPrompt = `
      You are EcoBot, an intelligent waste management and recycling assistant. 
      Help users with:
      - Waste classification and sorting
      - Recycling tips and best practices
      - Environmental impact information
      - Pickup scheduling and status
      - Sustainability advice
      
      Be friendly, helpful, and environmentally conscious in your responses.
      Keep responses concise but informative.
      ${context ? `Context: ${context}` : ''}
    `;

    try {
      const response = await fetch(`${this.BASE_URL}/gemini-1.5-flash:generateContent?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `${systemPrompt}\n\nUser: ${message}` }
            ]
          }]
        })
      });

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
      }
      
      throw new Error('No response from Gemini API');
    } catch (error) {
      console.error('Gemini Chat API Error:', error);
      
      // Fallback responses based on message content
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('plastic')) {
        return "I can help you with plastic recycling! Different types of plastic have different recycling codes (1-7). PET bottles (#1) and HDPE containers (#2) are commonly recyclable. Always clean containers before recycling.";
      } else if (lowerMessage.includes('pickup') || lowerMessage.includes('order')) {
        return "For waste pickup orders, I can help you track status and provide updates. Make sure to have your waste properly sorted and accessible for our pickup team.";
      } else if (lowerMessage.includes('recycle')) {
        return "Recycling is crucial for environmental sustainability! The key is proper sorting: clean containers, separate materials, and follow local guidelines. Every item recycled helps reduce landfill waste.";
      } else {
        return "Hello! I'm EcoBot, your waste management assistant. I can help you with recycling questions, waste classification, pickup scheduling, and environmental tips. How can I assist you today?";
      }
    }
  }

  private static extractInfo(text: string, keyword: string, fallback: string): string {
    const regex = new RegExp(`${keyword}[:\\s]*([^\\n\\.]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : fallback;
  }
}
