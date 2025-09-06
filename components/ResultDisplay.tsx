
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface ResultDisplayProps {
  imageUrl: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, onReset }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-md aspect-square bg-slate-800 rounded-2xl shadow-lg overflow-hidden border-2 border-cyan-400">
        <img src={imageUrl} alt="Generated ID" className="w-full h-full object-cover" />
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <a
          href={imageUrl}
          download="ai_id_photo.png"
          className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          다운로드
        </a>
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-bold text-slate-200 bg-slate-700 rounded-lg shadow-md hover:bg-slate-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <RefreshIcon className="w-5 h-5 mr-2" />
          새로 만들기
        </button>
      </div>
    </div>
  );
};
