import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';
import { EditParams } from './interfaces/ai-guide.interface';
import {
  getAnalyzePrompt,
  getEditParamsPrompt,
} from './constants/ai-guide.prompt';
import { MESSAGES } from 'src/common/constants/messages';

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
      const prompt = getAnalyzePrompt(context);

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();
      const parsed = this.safeParseJSON<{
        instruction: string;
        status: string;
      }>(text);

      return {
        instruction: parsed.instruction || text,
        status: parsed.status || 'needs_adjustment',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Gemini analyze error: ${errorMessage}`);
      throw new Error(MESSAGES.AI_GUIDE.ANALYZE_FAILED);
    }
  }

  async editImage(imageBase64: string, instruction: string): Promise<string> {
    try {
      const editParams = await this.getEditParamsFromInstruction(
        imageBase64,
        instruction,
      );

      const imageBuffer = this.base64ToBuffer(imageBase64);
      let img = sharp(imageBuffer);

      if (editParams.rotate !== undefined) {
        img = img.rotate(editParams.rotate);
      }

      if (editParams.crop) {
        const { width, height, left, top } = editParams.crop;
        img = img.extract({ width, height, left, top });
      }

      if (editParams.resize) {
        const { width, height } = editParams.resize;
        img = img.resize(width, height, {
          fit: 'cover',
          withoutEnlargement: true,
        });
      }

      if (
        editParams.brightness !== undefined ||
        editParams.saturation !== undefined
      ) {
        const brightness = editParams.brightness ?? 1;
        const saturation = editParams.saturation ?? 1;
        img = img.modulate({ brightness, saturation });
      }

      if (editParams.contrast !== undefined) {
        const contrast = editParams.contrast;
        img = img.linear(contrast, -(128 * contrast) + 128);
      }

      if (editParams.sharpness) {
        img = img.sharpen();
      }

      switch (editParams.filter) {
        case 'sepia':
          img = img.recomb([
            [0.393, 0.769, 0.189],
            [0.349, 0.686, 0.168],
            [0.272, 0.534, 0.131],
          ]);
          break;
        case 'grayscale':
          img = img.grayscale();
          break;
        case 'vintage':
          img = img.modulate({ saturation: 0.8 }).recomb([
            [1.0, 0.1, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 0.9],
          ]);
          break;
        case 'warm':
          img = img.recomb([
            [1.05, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 0.95],
          ]);
          break;
        case 'cool':
          img = img.recomb([
            [0.95, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.05],
          ]);
          break;
        case 'vibrant':
          img = img.modulate({ saturation: 1.25 });
          break;
      }

      const editedBuffer = await img.jpeg({ quality: 90 }).toBuffer();
      return `data:image/jpeg;base64,${editedBuffer.toString('base64')}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Edit image error: ${errorMessage}`);
      throw new BadRequestException(MESSAGES.AI_GUIDE.EDIT_FAILED);
    }
  }

  private async getEditParamsFromInstruction(
    imageBase64: string,
    instruction: string,
  ): Promise<EditParams> {
    try {
      const prompt = getEditParamsPrompt(instruction);

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();
      this.logger.debug(`Raw edit params response: ${text}`);

      const parsed = this.safeParseJSON<EditParams>(text);
      return parsed as EditParams;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to get edit params from AI: ${errorMessage}`);
      return {};
    }
  }

  private base64ToBuffer(base64: string): Buffer {
    const cleaned = base64.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(cleaned, 'base64');
  }

  private safeParseJSON<T>(text: string): Partial<T> {
    try {
      let clean = text.trim();
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      clean = clean.trim();

      if (!clean) return {};

      return JSON.parse(clean) as Partial<T>;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.warn(`JSON parse error: ${errorMessage}, text: ${text}`);
      return {};
    }
  }
}
