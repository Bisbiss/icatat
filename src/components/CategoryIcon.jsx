import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Tv,
  HeartPulse,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Sparkles,
  Gift,
  Coins,
  HelpCircle,
} from 'lucide-react';

const iconMap = {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Tv,
  HeartPulse,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Sparkles,
  Gift,
  Coins,
};

export default function CategoryIcon({ name, size = 18, color = 'currentColor', className = '' }) {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent size={size} color={color} className={className} />;
}
