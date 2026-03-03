import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiGuideService {
  private readonly logger = new Logger(AiGuideService.name);
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });
  }

  async analyzeImage(
    imageBase64: string,
    context?: string,
  ): Promise<{ instruction: string; status: string }> {
    try {
      const prompt = context
        ? `You are an expert photography assistant. Analyze this ${context} photo and provide a concise, actionable tip (1-2 sentences) in English to improve the composition, lighting, or pose. Also, determine if the photo is already good enough to be saved (respond with "status: good") or needs further adjustment (respond with "status: needs_adjustment"). Format your response as JSON: {"instruction": "...", "status": "good" or "needs_adjustment"}.`
        : `You are an expert photography assistant. Analyze the given image and provide a concise, actionable tip (1-2 sentences) in English to improve the composition, lighting, or pose. Also, determine if the photo is already good enough to be saved (respond with "status: good") or needs further adjustment (respond with "status: needs_adjustment"). Format your response as JSON: {"instruction": "...", "status": "good" or "needs_adjustment"}.`;

      const result = await this.model.generateContent([
        prompt,
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
      ]);

      const response = await result.response;
      const text = response.text();
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      let parsed;
      try {
        parsed = JSON.parse(cleanText);
      } catch (e) {
        parsed = { instruction: cleanText, status: 'needs_adjustment' };
      }

      const usage = response.usageMetadata;
      if (usage) {
        this.logger.log(
          `Token usage - Input: ${usage.promptTokenCount}, Output: ${usage.candidatesTokenCount}, Total: ${usage.totalTokenCount}`,
        );
      }

      return {
        instruction: parsed.instruction || cleanText,
        status: parsed.status || 'needs_adjustment',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Gemini API error: ${errorMessage}`);
      throw new Error('Unable to analyze image. Please try again later.');
    }
  }
}
