
import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  LayoutDashboard, 
  PiggyBank, 
  History, 
  Tags, 
  BookOpen, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Download, 
  Search,
  ChevronRight,
  Calculator,
  Bell,
  Heart,
  Sparkles,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Info,
  Edit2,
  Trash2,
  ChevronDown,
  Clock,
  Percent,
  Coins,
  Settings,
  Grid,
  Check,
  Flag,
  Trophy,
  Target,
  Rocket,
  ShieldCheck,
  ArrowUpRight,
  Flame,
  Star,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';
import { View, Transaction, TransactionType, Category, SavingGoal, User } from './types';
import { INITIAL_CATEGORIES, LEARNING_MODULES, YEAR_PLAN } from './constants';
import { getFinancialAdvice, getDashboardInsights } from './services/geminiService';

// Register Chart.js components and plugins
ChartJS.register(ArcElement, ChartTooltip, Legend, ChartDataLabels);

// --- Constants for UI Elements ---
const AVAILABLE_ICONS = [
  'Coffee', 'ShoppingBag', 'Book', 'Zap', 'Home', 'Heart', 'Plane', 'Smartphone', 
  'DollarSign', 'Briefcase', 'GraduationCap', 'Car', 'Utensils', 'Gift', 'Music', 
  'Tv', 'Activity', 'Shield', 'Tool', 'Camera', 'Bus', 'Wifi', 'Dumbbell', 'Gamepad',
  'Target', 'Star', 'Rocket', 'Map', 'Moon', 'Sun', 'Wind', 'Umbrella', 'Coffee', 'Trash2'
];

const AVAILABLE_COLORS = [
  '#F48FB1', '#CE93D8', '#81C784', '#FFF176', '#4FC3F7', '#FF8A65', '#9575CD', 
  '#A1887F', '#DCE775', '#4DD0E1', '#F06292', '#BA68C8'
];

// --- Helper Components ---

const CategoryIcon = ({ icon, color, className = "w-6 h-6" }: { icon: string, color: string, className?: string }) => {
  if (icon && icon.startsWith('data:image')) {
    return <img src={icon} alt="Icon" className={`${className} object-contain rounded-md`} />;
  }
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.HelpCircle;
  return <IconComponent className={className} style={{ color }} />;
};

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: any) => {
  const styles = {
    primary: 'bg-gradient-to-r from-[#F48FB1] to-[#CE93D8] text-white shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100',
    secondary: 'bg-white border-2 border-[#F48FB1] text-[#F48FB1] hover:bg-[#FCE4EC] transition-colors disabled:opacity-50',
    action: 'p-2 rounded-full bg-[#E1BEE7] text-white hover:bg-[#CE93D8] transition-colors',
    danger: 'bg-red-50 border-2 border-red-200 text-red-500 hover:bg-red-100 transition-colors',
    ghost: 'text-gray-500 hover:bg-gray-100'
  };
  return (
    <button disabled={disabled} type={type} onClick={onClick} className={`px-4 py-2 rounded-[20px] font-medium ${styles[variant as keyof typeof styles]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const Navbar = ({ activeView, setView, user, onLogout }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    { id: 'DASHBOARD', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'SAVINGS', icon: <PiggyBank size={20} />, label: 'Savings' },
    { id: 'HISTORY', icon: <History size={20} />, label: 'History' },
    { id: 'CATEGORIES', icon: <Tags size={20} />, label: 'Categories' },
    { id: 'LEARNING', icon: <BookOpen size={20} />, label: 'Education' },
    { id: 'PLAN', icon: <Calendar size={20} />, label: '1-Year Plan' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 pastel-pink rounded-xl flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Sarvam.ai</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${activeView === item.id ? 'bg-[#FCE4EC] text-[#F48FB1]' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
            <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
            <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-400"><LogOut size={20} /></button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as View); setIsOpen(false); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl ${activeView === item.id ? 'bg-[#FCE4EC] text-[#F48FB1]' : 'text-gray-600'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 text-red-500">
            <LogOut size={20} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('LOGIN');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Custom Icon Library
  const [customIcons, setCustomIcons] = useState<string[]>([]);
  
  // 1-Year Plan Completion State
  const [completedPlanMonths, setCompletedPlanMonths] = useState<number[]>([]);

  // History Page States
  const [historySearch, setHistorySearch] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('ALL');

  // Modals visibility
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);

  const [dashboardInsight, setDashboardInsight] = useState<string | null>(null);
  const [isRefreshingInsight, setIsRefreshingInsight] = useState(false);

  // Financial Calculator State
  const [calcType, setCalcType] = useState<'SIP' | 'RD' | 'FD'>('SIP');
  const [calcAmount, setCalcAmount] = useState(1000);
  const [calcYears, setCalcYears] = useState(1);
  const [calcRate, setCalcRate] = useState(12);

  // Form Shared States
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [newCatColor, setNewCatColor] = useState(AVAILABLE_COLORS[0]);
  const [newCatIcon, setNewCatIcon] = useState(AVAILABLE_ICONS[0]);
  
  // Goal specific states
  const [newGoalTarget, setNewGoalTarget] = useState(0);
  const [newGoalCurrent, setNewGoalCurrent] = useState(0);
  const [newGoalMonthly, setNewGoalMonthly] = useState(500);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Modular Category Functions ---

  const saveCategories = (cats: Category[]) => {
    localStorage.setItem('sarvam_categories', JSON.stringify(cats));
    setCategories(cats);
  };

  const loadCategories = () => {
    const saved = localStorage.getItem('sarvam_categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      saveCategories(INITIAL_CATEGORIES);
    }
  };

  const addCategory = (name: string, type: TransactionType) => {
    if (!name.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists && !editingCategory) {
      alert("This category name already exists.");
      return;
    }

    let updatedCats;
    if (editingCategory) {
      updatedCats = categories.map(c => 
        c.id === editingCategory.id ? { ...c, name, type, icon: newCatIcon, color: newCatColor } : c
      );
    } else {
      const newCat: Category = {
        id: Date.now().toString(),
        name,
        type,
        icon: newCatIcon,
        color: newCatColor
      };
      updatedCats = [...categories, newCat];
    }

    saveCategories(updatedCats);
    setIsAddingCategory(false);
    setEditingCategory(null);
    setNewCatName('');
  };

  const deleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const updatedCats = categories.filter(c => c.id !== id);
      saveCategories(updatedCats);
    }
  };

  // --- Goal Functions ---

  const handleEditGoal = (goal: SavingGoal) => {
    setEditingGoal(goal);
    setNewCatName(goal.name);
    setNewGoalTarget(goal.targetAmount);
    setNewGoalCurrent(goal.currentAmount);
    setNewGoalMonthly(goal.monthlyContribution);
    setNewCatColor(goal.color);
    setNewCatIcon(goal.icon);
    setIsAddingGoal(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm("Remove this goal? Your savings progress will remain as balance but the tracker will be gone.")) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const handleAddGoal = () => {
    if (!newCatName.trim()) {
      alert("Goal name is required.");
      return;
    }
    
    if (editingGoal) {
      setGoals(goals.map(g => 
        g.id === editingGoal.id 
          ? { 
              ...g, 
              name: newCatName, 
              targetAmount: newGoalTarget, 
              currentAmount: newGoalCurrent, 
              monthlyContribution: newGoalMonthly,
              icon: newCatIcon, 
              color: newCatColor 
            }
          : g
      ));
    } else {
      const newGoal: SavingGoal = {
        id: Date.now().toString(),
        name: newCatName,
        targetAmount: newGoalTarget,
        currentAmount: newGoalCurrent,
        monthlyContribution: newGoalMonthly,
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        icon: newCatIcon,
        color: newCatColor
      };
      setGoals([...goals, newGoal]);
    }
    
    setIsAddingGoal(false);
    setEditingGoal(null);
    setNewCatName('');
    setNewGoalTarget(0);
    setNewGoalCurrent(0);
  };

  // --- Persistence Handlers ---

  useEffect(() => {
    const savedUser = localStorage.getItem('sarvam_user');
    const savedTransactions = localStorage.getItem('sarvam_transactions');
    const savedGoals = localStorage.getItem('sarvam_goals');
    const savedCustomIcons = localStorage.getItem('sarvam_custom_icons');
    const savedPlanProgress = localStorage.getItem('sarvam_plan_progress');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('DASHBOARD');
    }
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    
    loadCategories();

    if (savedCustomIcons) setCustomIcons(JSON.parse(savedCustomIcons));
    if (savedPlanProgress) setCompletedPlanMonths(JSON.parse(savedPlanProgress));
    if (savedGoals) {
      const parsedGoals: SavingGoal[] = JSON.parse(savedGoals);
      setGoals(parsedGoals);
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('sarvam_user', JSON.stringify(user));
    localStorage.setItem('sarvam_transactions', JSON.stringify(transactions));
    localStorage.setItem('sarvam_goals', JSON.stringify(goals));
    localStorage.setItem('sarvam_custom_icons', JSON.stringify(customIcons));
    localStorage.setItem('sarvam_plan_progress', JSON.stringify(completedPlanMonths));
  }, [user, transactions, goals, customIcons, completedPlanMonths]);

  // --- Search & Filtering Logic ---

  const filteredHistory = useMemo(() => {
    const term = historySearch.trim().toLowerCase();
    
    return transactions.filter(t => {
      const cat = categories.find(c => c.id === t.category);
      const matchesSearch = 
        t.note.toLowerCase().includes(term) ||
        t.amount.toString().includes(term) ||
        t.date.includes(term) ||
        t.type.toLowerCase().includes(term) ||
        (cat?.name.toLowerCase().includes(term) ?? false);
        
      const matchesType = historyTypeFilter === 'ALL' || t.type === historyTypeFilter;
      const matchesCategory = historyCategoryFilter === 'ALL' || t.category === historyCategoryFilter;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, categories, historySearch, historyTypeFilter, historyCategoryFilter]);

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    
    let score = 50;
    if (savingsRate > 20) score += 20;
    if (savingsRate < 0) score -= 30;
    if (transactions.length > 5) score += 10;
    const finalScore = Math.min(Math.max(score, 0), 100);

    return { income, expenses, balance, savingsRate, finalScore };
  }, [transactions]);

  // --- Financial Calculation Logic ---
  const calcResult = useMemo(() => {
    const r = calcRate / 100;
    const t = calcYears;
    const months = t * 12;

    if (calcType === 'SIP') {
      const i = r / 12;
      const maturity = calcAmount * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
      const totalInvested = calcAmount * months;
      return { maturity, totalInvested, returns: maturity - totalInvested };
    } else if (calcType === 'RD') {
      const i = r / 4; 
      const maturity = calcAmount * ( (Math.pow(1+i, months/3) - 1) / (1 - Math.pow(1+i, -1/3)) );
      const totalInvested = calcAmount * months;
      return { maturity, totalInvested, returns: maturity - totalInvested };
    } else { 
      const maturity = calcAmount * Math.pow(1 + r/4, 4 * t); 
      const totalInvested = calcAmount;
      return { maturity, totalInvested, returns: maturity - totalInvested };
    }
  }, [calcType, calcAmount, calcYears, calcRate]);

  // --- Chart Logic ---
  const expenseChartData = useMemo(() => {
    const data = categories
      .map(c => {
        const amount = transactions
          .filter(t => t.category === c.id && t.type === TransactionType.EXPENSE)
          .reduce((acc, t) => acc + t.amount, 0);
        return { label: c.name, amount, color: c.color };
      })
      .filter(c => c.amount > 0);

    const total = data.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.amount),
        backgroundColor: data.map(d => d.color),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 12,
      }],
      total,
    };
  }, [transactions, categories]);

  const expenseChartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: 'Poppins', size: 11, weight: '500' }
        }
      },
      datalabels: {
        color: '#ffffff',
        font: { weight: 'bold' as const, size: 12 },
        formatter: (value: number, ctx: any) => {
          const total = ctx.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return percentage > 5 ? `${percentage}%` : null;
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#F8BBD0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label} – ₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '72%',
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  useEffect(() => {
    if (view === 'DASHBOARD' && user && !dashboardInsight) {
      fetchDashboardInsight();
    }
  }, [view, user]);

  const fetchDashboardInsight = async () => {
    setIsRefreshingInsight(true);
    const insight = await getDashboardInsights({
      income: stats.income,
      expenses: stats.expenses,
      balance: stats.balance,
      savingsRate: stats.savingsRate,
      goals,
      recentTransactions: transactions.slice(0, 5)
    });
    setDashboardInsight(insight);
    setIsRefreshingInsight(false);
  };

  const handleLogin = (username: string) => {
    const newUser = { username, isAuthenticated: true };
    setUser(newUser);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    localStorage.removeItem('sarvam_user');
    setUser(null);
    setView('LOGIN');
    setDashboardInsight(null);
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    setTransactions([{ ...t, id: Date.now().toString() }, ...transactions]);
    setIsAddingTransaction(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200000) { 
        alert("File too large! Please choose an image under 200KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomIcons(prev => [...prev, base64]);
        setNewCatIcon(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteCustomIcon = (iconToDelete: string) => {
    if (confirm("Delete this icon from your library?")) {
      setCustomIcons(prev => prev.filter(icon => icon !== iconToDelete));
      if (newCatIcon === iconToDelete) setNewCatIcon(AVAILABLE_ICONS[0]);
      setCategories(categories.map(c => c.icon === iconToDelete ? {...c, icon: AVAILABLE_ICONS[0]} : c));
      setGoals(goals.map(g => g.icon === iconToDelete ? {...g, icon: AVAILABLE_ICONS[0]} : g));
    }
  };

  const togglePlanMonth = (index: number) => {
    setCompletedPlanMonths(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    const botResponse = await getFinancialAdvice(userMsg);
    setChatMessages(prev => [...prev, { role: 'bot', text: botResponse || "I'm listening!" }]);
  };

  const handleExportToExcel = () => {
    if (filteredHistory.length === 0) { alert("No data to export!"); return; }
    const exportData = filteredHistory.map(t => ({
      Date: t.date, Type: t.type, Category: categories.find(c => c.id === t.category)?.name || 'Misc', Note: t.note, Amount: t.amount
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transaction-history.xlsx");
  };

  // Modular Icon Library Component for consistent use in modals
  const IconLibraryGrid = () => (
    <div className="space-y-6">
      {customIcons.length > 0 && (
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-pink-400 mb-2 block px-1 flex justify-between items-center">
            Your Custom Collection
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 p-4 bg-pink-50/20 rounded-2xl border border-pink-100">
            {customIcons.map((iconData, idx) => (
              <button
                key={`custom-${idx}`}
                onClick={() => setNewCatIcon(iconData)}
                className={`relative aspect-square flex items-center justify-center rounded-xl transition-all overflow-hidden ${newCatIcon === iconData ? 'bg-white shadow-md border-2 border-pink-400 scale-110 z-10' : 'bg-white/50 hover:bg-white hover:shadow-sm'}`}
              >
                <img src={iconData} alt="Custom" className="w-8 h-8 object-contain" />
                {newCatIcon === iconData && (
                  <div className="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-0.5">
                    <Check size={8} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block px-1">Standard Symbols</label>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 p-4 bg-gray-50 rounded-2xl max-h-56 overflow-y-auto border border-gray-100">
          {AVAILABLE_ICONS.map((iconName, idx) => (
            <button 
              key={`${iconName}-${idx}`} 
              onClick={() => setNewCatIcon(iconName)} 
              className={`relative aspect-square flex items-center justify-center rounded-xl transition-all ${newCatIcon === iconName ? 'bg-white shadow-md scale-110 z-10 border-2 border-gray-200' : 'text-gray-400 hover:bg-white hover:text-gray-600'}`}
            >
              <CategoryIcon icon={iconName} color={newCatIcon === iconName ? newCatColor : '#A0AEC0'} className="w-6 h-6" />
              {newCatIcon === iconName && (
                <div className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-0.5">
                  <Check size={8} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FCE4EC] via-[#F8BBD0] to-[#E1BEE7]">
        <Card className="max-w-md w-full glass p-10 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 pastel-pink rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">S</div>
            <h1 className="text-3xl font-bold text-gray-800">Sarvam.ai</h1>
            <p className="text-gray-500 mt-2 italic">Student Smart Money Manager</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" id="username" className="w-full" placeholder="Enter your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full" />
            </div>
            <Button className="w-full py-4 mt-2" onClick={() => handleLogin((document.getElementById('username') as HTMLInputElement).value || 'Student')}>Login</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-gray-800">
      <Navbar activeView={view} setView={setView} user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {view === 'DASHBOARD' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Hello, {user?.username}! 👋</h2>
                <p className="text-gray-500">Your financial wellness is looking {stats.finalScore > 70 ? 'great' : 'improving'}.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={fetchDashboardInsight} disabled={isRefreshingInsight} className="flex items-center gap-2"><RefreshCw size={18} className={isRefreshingInsight ? 'animate-spin' : ''} /> Refresh Insight</Button>
                <Button onClick={() => setIsAddingTransaction(true)} className="flex items-center gap-2"><Plus size={20} /> Add Transaction</Button>
              </div>
            </header>

            <Card className="bg-gradient-to-r from-[#E1BEE7] to-[#FCE4EC] border-none shadow-md overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={120} /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-purple-700"><Sparkles size={20} /><span className="text-xs font-bold uppercase tracking-widest">Sarvam AI Smart Insight</span></div>
                {isRefreshingInsight ? <div className="space-y-2 animate-pulse"><div className="h-4 bg-purple-200 rounded w-3/4"></div><div className="h-4 bg-purple-200 rounded w-1/2"></div></div> : <p className="text-lg font-medium text-gray-800 leading-relaxed italic">"{dashboardInsight || "Analyzing your spending habits to provide wisdom..."}"</p>}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-[#C8E6C9] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-[#E8F5E9] rounded-lg text-green-600"><TrendingUp size={20} /></div><span className="text-sm font-medium text-gray-500">Monthly Income</span></div>
                <div className="text-2xl font-bold">₹{stats.income.toLocaleString()}</div>
              </Card>
              <Card className="border-l-4 border-[#F8BBD0] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-[#FCE4EC] rounded-lg text-pink-600"><TrendingDown size={20} /></div><span className="text-sm font-medium text-gray-500">Expenses</span></div>
                <div className="text-2xl font-bold text-gray-800">₹{stats.expenses.toLocaleString()}</div>
              </Card>
              <Card className="border-l-4 border-[#B3E5FC] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-[#E1F5FE] rounded-lg text-blue-600"><Wallet size={20} /></div><span className="