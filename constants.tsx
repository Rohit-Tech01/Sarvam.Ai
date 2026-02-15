
import React from 'react';
import { TransactionType, Category } from './types';
import { 
  Coffee, ShoppingBag, Book, Zap, 
  Home, Heart, Plane, Smartphone, 
  DollarSign, Briefcase, GraduationCap 
} from 'lucide-react';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', icon: 'Coffee', color: '#F8BBD0', type: TransactionType.EXPENSE },
  { id: '2', name: 'Shopping', icon: 'ShoppingBag', color: '#E1BEE7', type: TransactionType.EXPENSE },
  { id: '3', name: 'Education', icon: 'Book', color: '#C8E6C9', type: TransactionType.EXPENSE },
  { id: '4', name: 'Utilities', icon: 'Zap', color: '#FFF9C4', type: TransactionType.EXPENSE },
  { id: '5', name: 'Pocket Money', icon: 'DollarSign', color: '#C8E6C9', type: TransactionType.INCOME },
  { id: '6', name: 'Part-time Job', icon: 'Briefcase', color: '#E1BEE7', type: TransactionType.INCOME },
  { id: '7', name: 'Scholarship', icon: 'GraduationCap', color: '#B3E5FC', type: TransactionType.INCOME },
];

export const LEARNING_MODULES = [
  {
    title: "The Lakshmi Mindset",
    content: "Financial discipline isn't about restriction; it's about freedom. Indian values emphasize 'Arth-Sanyam' – the balance of earning, saving, and purposeful spending.",
    icon: <Heart className="text-pink-400" />
  },
  {
    title: "50-30-20 Rule for Students",
    content: "Allocate 50% for Needs, 30% for Wants, and 20% for Savings/Investments. Even small amounts saved now grow exponentially through compounding.",
    icon: <Zap className="text-yellow-400" />
  },
  {
    title: "Understanding SIPs",
    content: "A Systematic Investment Plan (SIP) allows you to invest small amounts regularly in mutual funds. It's the perfect entry point for students.",
    icon: <Briefcase className="text-blue-400" />
  }
];

export const YEAR_PLAN = [
  { month: "Month 1", task: "Track every single expense", milestone: "Awareness" },
  { month: "Month 2", task: "Create your first 50-30-20 budget", milestone: "Discipline" },
  { month: "Month 3", task: "Set up an automatic saving of ₹500", milestone: "Automation" },
  { month: "Month 4", task: "Open a Recurring Deposit (RD)", milestone: "Consistency" },
  { month: "Month 5", task: "Identify and cut 2 non-essential expenses", milestone: "Optimization" },
  { month: "Month 6", task: "Build a ₹5,000 Emergency Fund", milestone: "Security" },
  { month: "Month 7", task: "Increase savings rate by 5%", milestone: "Growth" },
  { month: "Month 8", task: "Start reading about Stock Market basics", milestone: "Education" },
  { month: "Month 9", task: "Start your first ₹500 SIP", milestone: "Investment" },
  { month: "Month 10", task: "Review goals and adjust plan", milestone: "Reflection" },
  { month: "Month 11", task: "Save for a specific reward goal", milestone: "Motivation" },
  { month: "Month 12", task: "Evaluate total growth and celebrate!", milestone: "Success" },
];
