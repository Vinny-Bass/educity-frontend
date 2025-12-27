"use client";

import {
  Home,
  Wrench,
  DollarSign,
  Car,
  Building,
  Building2,
  Landmark,
  Briefcase,
  ShoppingBag,
  PiggyBank,
  Coins,
  CreditCard,
  Wallet,
  LucideIcon,
} from "lucide-react";

interface AssetIconProps {
  iconName: string;
  className?: string;
}

// Map icon names from API to lucide-react icons
// Browse all available icons at: https://lucide.dev/icons
const iconMap: Record<string, LucideIcon> = {
  // Current icons
  home: Home,
  wrench: Wrench,
  "currency-dollar": DollarSign,
  
  // Additional asset icons you can use
  car: Car,
  building: Building,
  "building-2": Building2,
  landmark: Landmark,
  briefcase: Briefcase,
  "shopping-bag": ShoppingBag,
  "piggy-bank": PiggyBank,
  coins: Coins,
  "credit-card": CreditCard,
  wallet: Wallet,
};

export const AssetIcon = ({ iconName, className }: AssetIconProps) => {
  const IconComponent = iconMap[iconName] || DollarSign; // Default to DollarSign if icon not found

  return <IconComponent className={className} />;
};





