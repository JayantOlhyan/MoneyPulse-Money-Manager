import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, TransactionType, Category, Currency } from '../types';

interface StatsProps {
  transactions: Transaction[];
  categories: Category[];
  currency: Currency;
}

export const Stats: React.FC<StatsProps> = ({ transactions, categories, currency }) => {
  const expenseTrans = transactions.filter(t => t.type === TransactionType.EXPENSE);
  const totalExpense = expenseTrans.reduce((sum, t) => sum + t.amount, 0);
  
  // Aggregate data by category
  const dataMap = new Map<string, number>();
  expenseTrans.forEach(t => {
    const current = dataMap.get(t.categoryId) || 0;
    dataMap.set(t.categoryId, current + t.amount);
  });

  const chartData = Array.from(dataMap.entries()).map(([catId, amount]) => {
    const cat = categories.find(c => c.id === catId);
    return {
      name: cat ? cat.name : 'Unknown',
      value: amount,
      color: cat ? cat.color : '#666'
    };
  }).sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white pb-24 flex flex-col">
      <div className="sticky top-0 bg-white dark:bg-[#1A1A1A] z-10 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold">Statistics</h2>
        <div className="bg-gray-200 dark:bg-[#2C2C2C] rounded-lg p-0.5 flex text-xs font-medium">
            <button className="px-3 py-1.5 bg-white dark:bg-[#424242] rounded text-gray-900 dark:text-white shadow">Monthly</button>
            <button className="px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Annual</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:h-full md:items-start max-w-6xl mx-auto w-full">
          {/* Chart Area */}
          <div className="p-6 flex flex-col items-center md:w-1/2 md:sticky md:top-20">
            <div className="h-64 w-full relative mb-4 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                    >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff', borderRadius: '8px' }} 
                    formatter={(value: number) => `${currency.symbol}${value.toFixed(2)}`}
                    />
                </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-500 uppercase font-medium tracking-wider">Total</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{currency.symbol}{totalExpense.toLocaleString()}</span>
                </div>
            </div>
          </div>

          {/* List Breakdown */}
          <div className="px-4 md:w-1/2 md:p-6 md:border-l border-gray-200 dark:border-gray-800">
            <h3 className="hidden md:block text-lg font-semibold mb-4 px-2">Breakdown</h3>
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ backgroundColor: item.color }}>
                            {(item.value / totalExpense * 100).toFixed(0)}%
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                          <div className="h-1 w-24 bg-gray-200 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(item.value / totalExpense * 100)}%`, backgroundColor: item.color }}></div>
                          </div>
                        </div>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200">{currency.symbol}{item.value.toFixed(2)}</span>
                </div>
              ))}
              
              {chartData.length === 0 && (
                <p className="text-center text-gray-500 py-8">No data for this period.</p>
              )}
          </div>
      </div>
    </div>
  );
};