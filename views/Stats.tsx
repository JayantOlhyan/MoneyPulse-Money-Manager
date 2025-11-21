import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, TransactionType, Category } from '../types';

interface StatsProps {
  transactions: Transaction[];
  categories: Category[];
}

export const Stats: React.FC<StatsProps> = ({ transactions, categories }) => {
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
    <div className="min-h-full bg-[#121212] text-white pb-24">
      <div className="sticky top-0 bg-[#1A1A1A] z-10 flex justify-between items-center p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold">Statistics</h2>
        <div className="bg-[#2C2C2C] rounded-lg p-0.5 flex text-xs font-medium">
            <button className="px-3 py-1.5 bg-[#424242] rounded text-white shadow">Monthly</button>
            <button className="px-3 py-1.5 text-gray-400 hover:text-white">Annual</button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6 flex flex-col items-center">
        <div className="h-64 w-full relative mb-4">
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
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
            </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-xs text-gray-500 uppercase font-medium tracking-wider">Total</span>
               <span className="text-2xl font-bold text-white">${totalExpense.toLocaleString()}</span>
            </div>
        </div>
      </div>

      {/* List Breakdown */}
      <div className="px-4">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ backgroundColor: item.color }}>
                        {(item.value / totalExpense * 100).toFixed(0)}%
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-200">{item.name}</span>
                      <div className="h-1 w-24 bg-gray-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(item.value / totalExpense * 100)}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                </div>
                <span className="font-bold text-gray-200">${item.value.toFixed(2)}</span>
            </div>
          ))}
          
          {chartData.length === 0 && (
             <p className="text-center text-gray-500 py-8">No data for this period.</p>
          )}
      </div>
    </div>
  );
};