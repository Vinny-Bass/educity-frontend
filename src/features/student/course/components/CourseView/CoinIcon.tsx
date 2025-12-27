import Image from "next/image";

interface CoinIconProps {
  className?: string;
}

export function CoinIcon({ className }: CoinIconProps) {
  return <Image src="/dollar_coin.svg" alt="Sendo" className={className} width={0} height={0} style={{ width: '100%', height: 'auto' }} />;
}
