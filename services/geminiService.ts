import { GoogleGenAI, Modality } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateIdPhoto = async (imageFile: File, prompt: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image-preview';

  const { base64Data, mimeType } = await fileToBase64(imageFile);

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });
  
  if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts) {
    console.error("Invalid API response structure:", response);
    throw new Error("API가 비정상적인 응답을 반환했습니다.");
  }

  let imageUrl: string | null = null;
  let responseText = '';

  // Find the image part in the response
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes = part.inlineData.data;
      const imageMimeType = part.inlineData.mimeType;
      imageUrl = `data:${imageMimeType};base64,${base64ImageBytes}`;
      break; // Found image, exit loop
    } else if (part.text) {
      responseText += part.text;
    }
  }

  if (imageUrl) {
    return imageUrl;
  }

  if (responseText) {
    throw new Error(`AI가 이미지를 생성하지 못했습니다. 받은 응답: ${responseText}`);
  }

  throw new Error("API 응답에서 이미지 데이터를 찾을 수 없습니다.");
};
