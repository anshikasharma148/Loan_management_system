'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/utils';
import { loanApplicationsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import LoanApplicationCard from '@/components/LoanApplicationCard';
import toast from 'react-hot-toast';

export default function OngoingLoansPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOngoingLoans();
  }, [router]);

  const fetchOngoingLoans = async () => {
    try {
      const response = await loanApplicationsAPI.getOngoing();
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch ongoing loans');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Ongoing Loans</h1>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No ongoing loans found</p>
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

