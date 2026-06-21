import React, { useEffect, useState } from 'react';

export default function UpdateModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenUpdateMsg_v1');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenUpdateMsg_v1', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="bg-[#ff2b3d]/10 px-6 py-4 flex items-center justify-center border-b border-[#ff4a5a]/20">
          <h3 className="font-poppins font-black text-xl text-[#e01424] tracking-tight">
            🚨 Atenção, gênios da bola!
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex flex-col gap-4">
          <p className="font-sans text-[#3e4a3d] text-sm md:text-base leading-relaxed">
            Os palpites foram deletados por conta da atualização do app.
          </p>
          <p className="font-sans text-[#3e4a3d] text-sm md:text-base leading-relaxed">
            Na prática, isso significa que a galera que estava passando vergonha ganhou uma segunda chance completamente imerecida.
          </p>
          <p className="font-sans text-[#3e4a3d] text-sm md:text-base leading-relaxed">
            Aproveitem bem, porque nem sempre a tecnologia resolve a falta de conhecimento futebolístico de vocês.
          </p>
          <p className="font-sans text-[#3e4a3d] text-sm md:text-base leading-relaxed">
            Em breve teremos novos campeonatos disponíveis para novos palpites, novos erros e novas desculpas esfarrapadas.
          </p>
          <p className="font-sans font-bold text-[#191c1e] text-sm md:text-base leading-relaxed mt-2 text-center">
            Boa sorte a todos. Principalmente para quem precisa. ⚽😂
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 mt-auto">
          <button
            onClick={handleClose}
            className="w-full bg-[#006b2c] hover:bg-[#00873a] active:bg-[#005722] text-white font-bold py-3.5 rounded-2xl shadow-md transition-all active:scale-95 text-base md:text-lg cursor-pointer"
          >
            Entendi (Eu acho)
          </button>
        </div>
      </div>
    </div>
  );
}
