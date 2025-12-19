'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/utils';
import { loanApplicationsAPI, loanProductsAPI, collateralsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalApplications: 0,
    ongoingLoans: 0,
    totalCollaterals: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const [applications, ongoing, collaterals, products] = await Promise.all([
        loanApplicationsAPI.getAll(),
        loanApplicationsAPI.getOngoing(),
        collateralsAPI.getAll(),
        loanProductsAPI.getAll(),
      ]);

      setStats({
        totalApplications: applications.data.data?.length || 0,
        ongoingLoans: ongoing.data.data?.length || 0,
        totalCollaterals: collaterals.data.data?.length || 0,
        totalProducts: products.data.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  const statCards = [
    { label: 'Total Applications', value: stats.totalApplications, href: '/loan-applications', color: 'accent' },
    { label: 'Ongoing Loans', value: stats.ongoingLoans, href: '/ongoing-loans', color: 'slate' },
    { label: 'Total Collaterals', value: stats.totalCollaterals, href: '/collaterals', color: 'accent' },
    { label: 'Loan Products', value: stats.totalProducts, href: '/loan-products', color: 'slate' },
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's an overview of your loan management system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={card.label}
              className="glass-effect rounded-xl p-6 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">{card.label}</h3>
                <div className={`w-10 h-10 rounded-lg bg-${card.color}-50 flex items-center justify-center`}>
                  <div className={`w-3 h-3 rounded-full bg-${card.color}-500`}></div>
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-4">{card.value}</p>
              <Link
                href={card.href}
                className="text-sm font-medium text-accent-600 hover:text-accent-700 inline-flex items-center group"
              >
                View all
                <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="glass-effect rounded-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/loan-applications/new"
              className="group px-6 py-4 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-lg text-center font-medium shadow-lg hover:shadow-xl hover:from-accent-700 hover:to-accent-800 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Create New Application
            </Link>
            <Link
              href="/loan-products"
              className="group px-6 py-4 glass-effect rounded-lg text-center font-medium text-slate-700 hover:bg-slate-50 transition-all duration-300"
            >
              Manage Products
            </Link>
            <Link
              href="/api-docs"
              className="group px-6 py-4 glass-effect rounded-lg text-center font-medium text-slate-700 hover:bg-slate-50 transition-all duration-300"
            >
              API Documentation
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

