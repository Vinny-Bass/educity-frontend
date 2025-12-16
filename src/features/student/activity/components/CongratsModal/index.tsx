import Image from "next/image";
import { Button } from "@/components/ui/button";

interface CongratsModalProps {
  sendosEarned: number;
  onContinue: () => void;
}

export function CongratsModal({ sendosEarned, onContinue }: CongratsModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with blur and color */}
      <div
        className="absolute inset-0 bg-[#0E0420]/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-8 relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
            <Image
              src="/congrats_cat.svg"
              alt="Congrats Cat"
              fill
              className="object-contain"
              priority
            />
        </div>

        <h2 className="font-baloo text-3xl md:text-4xl text-white mb-2">
          You earned <span className="text-[#D6C1FF]">{sendosEarned} Sendos</span>
        </h2>

        <p className="font-baloo-2 text-lg md:text-xl text-gray-200 mb-10 max-w-md">
          Awesome! You nailed it.
          <br />
          Now, on to the next step!
        </p>

        <Button
          onClick={onContinue}
          className="h-12 px-12 rounded-[20px] bg-[#9056F5] hover:bg-[#7A45D4] text-white font-baloo text-xl transition-colors"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}



