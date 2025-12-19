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
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
            <Link href="/loan-applications" className="text-primary-600 text-sm mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Ongoing Loans</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.ongoingLoans}</p>
            <Link href="/ongoing-loans" className="text-primary-600 text-sm mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Collaterals</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCollaterals}</p>
            <Link href="/collaterals" className="text-primary-600 text-sm mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Loan Products</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            <Link href="/loan-products" className="text-primary-600 text-sm mt-2 inline-block">
              View all →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/loan-applications/new"
              className="px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-center transition-colors"
            >
              Create New Application
            </Link>
            <Link
              href="/loan-products"
              className="px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-center transition-colors"
            >
              Manage Products
            </Link>
            <Link
              href="/api-docs"
              className="px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-center transition-colors"
            >
              API Documentation
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

