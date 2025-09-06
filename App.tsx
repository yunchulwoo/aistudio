
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { generateIdPhoto } from './services/geminiService';
import { ArrowRightIcon } from './components/icons/ArrowRightIcon';

const App: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setOriginalFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setGeneratedImageUrl(null);
    setError(null);
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!originalFile) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const prompt = "제공된 사진을 바탕으로, 이 인물의 조금 더 어린 시절의 모습을 상상하여 전문적인 증명사진으로 재창조해주세요. 다음 지침을 엄격히 준수하세요: 1. 얼굴: 피부를 단순 보정하는 것을 넘어, 10대 후반에서 20대 초반의 모습처럼 자연스럽게 탱탱하고 탄력 있는 피부결로 재창조합니다. 미세한 주름을 제거하고 생기 넘치는 인상을 만들어주세요. 2. 헤어스타일: 현재의 기본 스타일을 유지하되, 더 젊고 트렌디한 느낌으로 세련되게 다듬습니다. 3. 배경: 전문 스튜디오에서 촬영한 것처럼 부드러운 오프화이트/옅은 회색 배경으로 교체합니다. 4. 결과물: 최종 결과물은 반드시 이미지만 포함해야 하며, 어떠한 텍스트나 대화도 추가하지 마십시오.";
      const imageUrl = await generateIdPhoto(originalFile, prompt);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      setError(`사진 생성에 실패했습니다. ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalFile]);

  const handleReset = useCallback(() => {
    setOriginalFile(null);
    setPreviewUrl(null);
    setGeneratedImageUrl(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <Header />
      <main className="w-full max-w-6xl flex flex-col items-center flex-grow">
        {!previewUrl ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
              <div className="flex flex-col items-center w-full">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">원본 사진</h2>
                <div className="relative w-full max-w-md aspect-square bg-slate-800 rounded-2xl shadow-lg overflow-hidden border-2 border-slate-700">
                  <img src={previewUrl} alt="Original" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col items-center w-full">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">AI 생성 증명사진</h2>
                {isLoading ? (
                  <div className="w-full max-w-md aspect-square flex flex-col justify-center items-center bg-slate-800 rounded-2xl shadow-lg border-2 border-slate-700">
                    <Loader />
                    <p className="mt-4 text-slate-400 text-center px-4">AI가 증명사진을 만들고 있어요...<br/>최대 1분 정도 소요될 수 있습니다.</p>
                  </div>
                ) : generatedImageUrl ? (
                  <ResultDisplay imageUrl={generatedImageUrl} onReset={handleReset} />
                ) : (
                  <div className="w-full max-w-md aspect-square flex justify-center items-center bg-slate-800 rounded-2xl shadow-lg border-2 border-dashed border-slate-600">
                    <p className="text-slate-500">결과가 여기에 표시됩니다.</p>
                  </div>
                )}
              </div>
            </div>
            
            {!generatedImageUrl && !isLoading && (
              <div className="mt-12 flex flex-col items-center">
                <button
                  onClick={handleGenerateClick}
                  disabled={isLoading}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center">
                    증명사진 생성하기
                    <ArrowRightIcon className="ml-2 h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            )}

            {error && <p className="mt-8 text-red-400 text-center max-w-2xl">{error}</p>}
          </div>
        )}
      </main>
       <footer className="w-full text-center p-4 mt-auto text-slate-500">
        <p>&copy; {new Date().getFullYear()} AI ID Photo Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
