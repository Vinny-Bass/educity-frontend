"use client";

import { useRouter } from "next/navigation";

interface MyAssetsProps {
  onClick?: () => void;
}

export const MyAssets = ({ onClick }: MyAssetsProps) => {
  const router = useRouter();

  const handleMyAssetsClick = () => {
    router.push("/student/sendos?assets=true");
  };

  return (
    <div
      className={`bg-[#FFF4E3] rounded-xl-plus p-4 flex items-center justify-between cursor-pointer transition-opacity hover:opacity-90`}
      onClick={onClick ? onClick : handleMyAssetsClick}
    >
      <span className="font-baloo text-[20px] font-normal text-foreground">
        My assets
      </span>

      <div className="flex items-center gap-2">
        <span className="font-baloo text-[20px] font-normal text-foreground">&gt;</span>
      </div>
    </div>
  );
};

