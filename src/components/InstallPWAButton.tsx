import { useState, useEffect } from 'react';
import { CloudDownload } from 'lucide-react';

export default function InstallPWAButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const checkStandalone = () => {
      const isStandAlone = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone === true;
      setIsStandalone(isStandAlone);
    };

    checkStandalone();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if deferredPrompt is already set (if the event fired before this component mounted)
    if ((window as any).deferredPrompt) {
      setIsInstallable(true);
    }

    // Listen for the custom event we added in main.tsx
    const handlePwaAvailable = () => {
      setIsInstallable(true);
    };

    window.addEventListener('pwa-install-available', handlePwaAvailable);

    return () => {
      window.removeEventListener('pwa-install-available', handlePwaAvailable);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt;
    if (!promptEvent) {
      alert("A instalação direta não está disponível no momento.");
      return;
    }

    // Show the install prompt
    promptEvent.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação da PWA');
      setIsInstallable(false);
    } else {
      console.log('Usuário recusou a instalação da PWA');
    }

    // We no longer need the prompt. Clear it up.
    (window as any).deferredPrompt = null;
  };

  const handleIOSClick = () => {
    alert("Para instalar este app no iPhone, toque no botão de compartilhar do Safari e selecione 'Adicionar à Tela de Início'.");
  };

  // Do not render anything if the app is already installed
  if (isStandalone) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-center gap-5 w-full mt-6 mb-2">
      <div 
        className="w-[90px] h-[90px] md:w-[100px] md:h-[100px] shrink-0 rounded-full flex items-center justify-center bg-[#eef0f4]"
        style={{
          boxShadow: '8px 8px 16px rgba(163, 177, 198, 0.4), -8px -8px 16px rgba(255, 255, 255, 1)'
        }}
      >
        {/* Track Container (Recessed) */}
        <div 
          className="w-[74px] h-[74px] md:w-[84px] md:h-[84px] rounded-full relative overflow-hidden"
        >
          {/* Spinning Yellow Progress */}
          <div 
            className="absolute inset-0 animate-[spin_3s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, #f4c05f 0deg, #f4c05f 135deg, #e6e9ee 135deg, #e6e9ee 360deg)'
            }}
          />
          
          {/* Static Inset Shadow Overlay to maintain 3D effect */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: 'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.6)'
            }}
          />

          {/* Inner Button (Raised) */}
          <button 
            onClick={isIOS ? handleIOSClick : (isInstallable ? handleInstallClick : () => alert("Abra este site no Google Chrome no Android para instalar o App."))}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[54px] h-[54px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center bg-[#eef0f4] cursor-pointer outline-none active:scale-95 transition-transform z-10"
            style={{
              boxShadow: '4px 4px 10px rgba(163, 177, 198, 0.4), -4px -4px 10px rgba(255, 255, 255, 1)'
            }}
            aria-label="Instalar App"
          >
            <CloudDownload className="w-6 h-6 md:w-7 md:h-7 text-[#8e9894]" strokeWidth={2} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-start justify-center">
        <span className="font-sans text-[15px] font-bold text-[#191c1e] leading-tight">Instalar App</span>
        <span className="font-sans text-[11px] text-[#6e7b6c] mt-0.5 leading-tight">Acesso rápido e fácil</span>
      </div>
    </div>
  );
}
