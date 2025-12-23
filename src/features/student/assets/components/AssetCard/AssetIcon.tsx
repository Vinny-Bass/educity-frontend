"use client";

import { Home, Wrench, DollarSign, LucideIcon } from "lucide-react";

interface AssetIconProps {
  iconName: string;
  className?: string;
}

// Map icon names from API to lucide-react icons
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  wrench: Wrench,
  "currency-dollar": DollarSign,
};

export const AssetIcon = ({ iconName, className }: AssetIconProps) => {
  const IconComponent = iconMap[iconName] || DollarSign; // Default to DollarSign if icon not found

  return <IconComponent className={className} />;
};



