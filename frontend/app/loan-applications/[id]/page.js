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
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Application not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loan Application Details</h1>
            <p className="text-gray-500 mt-1">Application #: {application.applicationNumber}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{application.customerInfo?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PAN</p>
                <p className="font-medium">{application.customerInfo?.pan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aadhaar</p>
                <p className="font-medium">{application.customerInfo?.aadhaar}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{application.customerInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{application.customerInfo?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{application.customerInfo?.address}</p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="font-medium">
                  {typeof application.loanProductId === 'object'
                    ? application.loanProductId.name
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Requested Amount</p>
                <p className="font-medium text-lg">{formatCurrency(application.requestedAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">LTV Ratio</p>
                <p className="font-medium text-lg">{application.calculatedLTV?.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="font-medium text-lg">{application.interestRate?.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tenure</p>
                <p className="font-medium">{application.tenure} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Collateral Value</p>
                <p className="font-medium text-lg">{formatCurrency(application.collateralValue)}</p>
              </div>
              {application.disbursedAmount && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Disbursed Amount</p>
                    <p className="font-medium text-lg">{formatCurrency(application.disbursedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Disbursed Date</p>
                    <p className="font-medium">{formatDate(application.disbursedDate)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mutual Funds */}
        {application.mutualFunds && application.mutualFunds.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Mutual Fund Holdings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fund Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AMC</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NAV</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {application.mutualFunds.map((fund, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm">{fund.fundName}</td>
                      <td className="px-4 py-3 text-sm">{fund.amc}</td>
                      <td className="px-4 py-3 text-sm">{fund.units?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm">₹{fund.currentNAV?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(fund.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Collaterals */}
        {collaterals.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Collaterals</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fund Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NAV</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collaterals.map((collateral) => (
                    <tr key={collateral._id}>
                      <td className="px-4 py-3 text-sm">{collateral.fundName}</td>
                      <td className="px-4 py-3 text-sm">{collateral.folioNumber}</td>
                      <td className="px-4 py-3 text-sm">{collateral.units?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm">₹{collateral.currentNAV?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(collateral.totalValue)}</td>
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {application.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('under_review')}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Move to Under Review
                </button>
              )}
              {application.status === 'under_review' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={updating}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updating}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </>
              )}
              {application.status === 'approved' && (
                <button
                  onClick={() => handleStatusUpdate('disbursed')}
                  disabled={updating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  Mark as Disbursed
                </button>
              )}
              {application.status === 'disbursed' && (
                <button
                  onClick={() => handleStatusUpdate('closed')}
                  disabled={updating}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
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

