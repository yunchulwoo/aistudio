
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center my-8 md:my-12">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
        AI 프로필 사진 생성기
      </h1>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        Nano Banana AI를 사용하여 당신의 사진을 야간 도시 감성의 프로필 사진으로 바꿔보세요.
      </p>
    </header>
  );
};