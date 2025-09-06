
interface Base64ConversionResult {
  base64Data: string;
  mimeType: string;
}

export const fileToBase64 = (file: File): Promise<Base64ConversionResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is in format "data:image/jpeg;base64,...."
      // we need to extract the base64 part and the mime type
      const mimeType = result.substring(5, result.indexOf(';'));
      const base64Data = result.substring(result.indexOf(',') + 1);
      resolve({ base64Data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};
