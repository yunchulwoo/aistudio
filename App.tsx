
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
      const prompt = "가장 중요한 규칙: 원본 사진 속 인물의 눈매, 코, 입 등 고유한 얼굴 특징은 반드시 유지해주세요. 이 규칙을 최우선으로 지키면서, 원본 사진을 다음과 같은 스타일로 변환해주세요: 1. 분위기: 야간 도시 거리의 감성적인 분위기. 배경에 부드러운 보케 효과가 있는 조명. 2. 인물: 20대 초반의 젊고 자연스러운 모습. 3. 의상: 검은색 가죽 자켓. 4. 헤어: 길고 자연스러운 검은색 머리. 5. 결과물: 어떠한 텍스트 설명도 없이, 최종 결과 이미지만 생성해주세요.";
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
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">AI 생성 프로필 사진</h2>
                {isLoading ? (
                  <div className="w-full max-w-md aspect-square flex flex-col justify-center items-center bg-slate-800 rounded-2xl shadow-lg border-2 border-slate-700">
                    <Loader />
                    <p className="mt-4 text-slate-400 text-center px-4">AI가 프로필 사진을 만들고 있어요...<br/>최대 1분 정도 소요될 수 있습니다.</p>
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
                    프로필 사진 생성하기
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
        <p>&copy; {new Date().getFullYear()} AI Profile Photo Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;