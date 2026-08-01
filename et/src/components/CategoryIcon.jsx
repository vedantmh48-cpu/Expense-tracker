import React from 'react';
import {
  UtensilsCrossed,
  Home,
  Zap,
  ShoppingBag,
  TrendingUp,
  Receipt,
  Car,
  Film,
  Stethoscope,
  Briefcase,
  Laptop,
  Gift,
  Tag,
  Smartphone,
  CreditCard,
  Landmark,
  Banknote,
} from 'lucide-react';

export const CategoryIcon = ({ iconId, className = 'w-4 h-4' }) => {
  const iconMap = {
    food: UtensilsCrossed,
    rent: Home,
    upi: Zap,
    shopping: ShoppingBag,
    investment: TrendingUp,
    bills: Receipt,
    travel: Car,
    entertainment: Film,
    health: Stethoscope,
    salary: Briefcase,
    freelance: Laptop,
    cashback: Gift,
    other: Tag,
    // Payment methods
    pm_upi: Smartphone,
    pm_credit: CreditCard,
    pm_debit: CreditCard,
    pm_netbanking: Landmark,
    pm_cash: Banknote,
  };

  const IconComponent = iconMap[iconId] || Tag;
  return <IconComponent className={className} />;
};
