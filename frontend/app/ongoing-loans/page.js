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
          <h1 className="text-4xl font-bold gradient-text mb-2">Ongoing Loans</h1>
          <p className="text-slate-600">View all active and disbursed loans</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 glass-effect rounded-xl">
            <p className="text-slate-500">No ongoing loans found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application, index) => (
              <div key={application._id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-scale-in">
                <LoanApplicationCard application={application} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

