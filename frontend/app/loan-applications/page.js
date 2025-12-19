'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/utils';
import { loanApplicationsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import LoanApplicationCard from '@/components/LoanApplicationCard';
import toast from 'react-hot-toast';

export default function LoanApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    fetchApplications();
  }, [router, filter]);

  const fetchApplications = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await loanApplicationsAPI.getAll(params);
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch loan applications');
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Loan Applications</h1>
        </div>

        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="disbursed">Disbursed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No loan applications found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <LoanApplicationCard key={application._id} application={application} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

