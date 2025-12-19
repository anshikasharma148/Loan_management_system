'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/utils';
import { collateralsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CollateralsPage() {
  const router = useRouter();
  const [collaterals, setCollaterals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCollaterals();
  }, [router, filter]);

  const fetchCollaterals = async () => {
    try {
      const params = filter !== 'all' ? { pledgeStatus: filter } : {};
      const response = await collateralsAPI.getAll(params);
      if (response.data.success) {
        setCollaterals(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch collaterals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2 text-slate-500">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold gradient-text mb-2">Collateral Management</h1>
          <p className="text-slate-600">Track and manage all mutual fund collaterals</p>
        </div>

        <div className="mb-6 animate-slide-up">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white text-slate-700 font-medium transition-all"
          >
            <option value="all">All Collaterals</option>
            <option value="pledged">Pledged</option>
            <option value="unpledged">Unpledged</option>
            <option value="released">Released</option>
          </select>
        </div>

        {collaterals.length === 0 ? (
          <div className="text-center py-16 glass-effect rounded-xl">
            <p className="text-slate-500">No collaterals found</p>
          </div>
        ) : (
          <div className="glass-effect rounded-xl overflow-hidden shadow-lg animate-scale-in">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Fund Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      AMC
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Folio Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Units
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      NAV
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Loan Application
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {collaterals.map((collateral) => (
                    <tr key={collateral._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {collateral.fundName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {collateral.amc}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                        {collateral.folioNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {collateral.units.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        ₹{collateral.currentNAV.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                        {formatCurrency(collateral.totalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={collateral.pledgeStatus} type="pledge" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                        {collateral.loanApplicationId?.applicationNumber || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

