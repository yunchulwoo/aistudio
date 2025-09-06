
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center my-8 md:my-12">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
        AI 증명사진 생성기
      </h1>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        Nano Banana AI를 사용하여 평범한 사진을 완벽한 증명사진으로 변신시켜 보세요.
      </p>
    </header>
  );
};
