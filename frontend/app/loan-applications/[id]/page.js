'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUser } from '@/lib/utils';
import { loanApplicationsAPI, collateralsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function LoanApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState(null);
  const [collaterals, setCollaterals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const user = getUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchApplication();
  }, [router, user, params.id]);

  const fetchApplication = async () => {
    try {
      const [appResponse, collResponse] = await Promise.all([
        loanApplicationsAPI.getById(params.id),
        collateralsAPI.getByLoan(params.id),
      ]);

      if (appResponse.data.success) {
        setApplication(appResponse.data.data.application);
        setCollaterals(collResponse.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    setUpdating(true);
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'disbursed' && !application.disbursedAmount) {
        updateData.disbursedAmount = application.requestedAmount;
        updateData.disbursedDate = new Date().toISOString();
      }

      const response = await loanApplicationsAPI.update(params.id, updateData);
      if (response.data.success) {
        toast.success('Application updated successfully');
        fetchApplication();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update application');
    } finally {
      setUpdating(false);
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

  if (!application) {
    return (
      <Layout>
        <div className="text-center py-16 glass-effect rounded-xl">
          <p className="text-slate-500">Application not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Loan Application Details</h1>
            <p className="text-slate-600 font-mono">Application #: {application.applicationNumber}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Information */}
          <div className="glass-effect rounded-xl p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Customer Information</h2>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Name</p>
                <p className="font-bold text-slate-900">{application.customerInfo?.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">PAN</p>
                <p className="font-semibold text-slate-900 font-mono">{application.customerInfo?.pan}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Aadhaar</p>
                <p className="font-semibold text-slate-900 font-mono">{application.customerInfo?.aadhaar}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</p>
                <p className="font-semibold text-slate-900">{application.customerInfo?.email}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                <p className="font-semibold text-slate-900">{application.customerInfo?.phone}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Address</p>
                <p className="font-semibold text-slate-900">{application.customerInfo?.address}</p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="glass-effect rounded-xl p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Loan Details</h2>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-accent-50 border border-accent-200">
                <p className="text-xs font-semibold text-accent-700 uppercase tracking-wide mb-1">Product</p>
                <p className="font-bold text-slate-900">
                  {typeof application.loanProductId === 'object'
                    ? application.loanProductId.name
                    : 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Requested Amount</p>
                <p className="font-bold text-2xl text-slate-900">{formatCurrency(application.requestedAmount)}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">LTV Ratio</p>
                <p className="font-bold text-xl text-slate-900">{application.calculatedLTV?.toFixed(2)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Interest Rate</p>
                <p className="font-bold text-xl text-slate-900">{application.interestRate?.toFixed(2)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Tenure</p>
                <p className="font-bold text-slate-900">{application.tenure} months</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Collateral Value</p>
                <p className="font-bold text-xl text-slate-900">{formatCurrency(application.collateralValue)}</p>
              </div>
              {application.disbursedAmount && (
                <>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Disbursed Amount</p>
                    <p className="font-bold text-xl text-slate-900">{formatCurrency(application.disbursedAmount)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Disbursed Date</p>
                    <p className="font-semibold text-slate-900">{formatDate(application.disbursedDate)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mutual Funds */}
        {application.mutualFunds && application.mutualFunds.length > 0 && (
          <div className="glass-effect rounded-xl p-6 mb-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Mutual Fund Holdings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Fund Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">AMC</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Units</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">NAV</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {application.mutualFunds.map((fund, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{fund.fundName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{fund.amc}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{fund.units?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">₹{fund.currentNAV?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">{formatCurrency(fund.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Collaterals */}
        {collaterals.length > 0 && (
          <div className="glass-effect rounded-xl p-6 mb-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Collaterals</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Fund Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Folio</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Units</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">NAV</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {collaterals.map((collateral) => (
                    <tr key={collateral._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{collateral.fundName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 font-mono">{collateral.folioNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{collateral.units?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">₹{collateral.currentNAV?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">{formatCurrency(collateral.totalValue)}</td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={collateral.pledgeStatus} type="pledge" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Status Update Actions */}
        {(user?.role === 'admin' || user?.role === 'loan_officer') && (
          <div className="glass-effect rounded-xl p-6 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Update Status</h2>
            <div className="flex flex-wrap gap-3">
              {application.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('under_review')}
                  disabled={updating}
                  className="px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-accent-700 hover:to-accent-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Move to Under Review
                </button>
              )}
              {application.status === 'under_review' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={updating}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating}
                    className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-rose-700 hover:to-rose-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Reject
                  </button>
                </>
              )}
              {application.status === 'approved' && (
                <button
                  onClick={() => handleStatusUpdate('disbursed')}
                  disabled={updating}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Mark as Disbursed
                </button>
              )}
              {application.status === 'disbursed' && (
                <button
                  onClick={() => handleStatusUpdate('closed')}
                  disabled={updating}
                  className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-slate-700 hover:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Close Loan
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

