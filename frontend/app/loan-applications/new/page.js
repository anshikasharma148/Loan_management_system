'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUser } from '@/lib/utils';
import { loanProductsAPI, loanApplicationsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function NewLoanApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerInfo: {
      name: '',
      pan: '',
      aadhaar: '',
      email: '',
      phone: '',
      address: '',
    },
    loanProductId: searchParams.get('productId') || '',
    requestedAmount: '',
    tenure: '',
    mutualFunds: [{ fundName: '', schemeCode: '', amc: '', folioNumber: '', units: '', currentNAV: '' }],
  });

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await loanProductsAPI.getAll({ isActive: 'true' });
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch loan products');
    }
  };

  const handleInputChange = (e, section = null, index = null) => {
    const { name, value } = e.target;
    if (section === 'customerInfo') {
      setFormData({
        ...formData,
        customerInfo: { ...formData.customerInfo, [name]: value },
      });
    } else if (section === 'mutualFunds') {
      const newFunds = [...formData.mutualFunds];
      newFunds[index] = { ...newFunds[index], [name]: value };
      if (name === 'units' || name === 'currentNAV') {
        const units = parseFloat(newFunds[index].units) || 0;
        const nav = parseFloat(newFunds[index].currentNAV) || 0;
        newFunds[index].totalValue = units * nav;
      }
      setFormData({ ...formData, mutualFunds: newFunds });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addMutualFund = () => {
    setFormData({
      ...formData,
      mutualFunds: [...formData.mutualFunds, { fundName: '', schemeCode: '', amc: '', folioNumber: '', units: '', currentNAV: '' }],
    });
  };

  const removeMutualFund = (index) => {
    const newFunds = formData.mutualFunds.filter((_, i) => i !== index);
    setFormData({ ...formData, mutualFunds: newFunds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        requestedAmount: parseFloat(formData.requestedAmount),
        tenure: parseInt(formData.tenure),
        mutualFunds: formData.mutualFunds.map(fund => ({
          ...fund,
          units: parseFloat(fund.units) || 0,
          currentNAV: parseFloat(fund.currentNAV) || 0,
          totalValue: (parseFloat(fund.units) || 0) * (parseFloat(fund.currentNAV) || 0),
        })).filter(fund => fund.fundName && fund.units > 0 && fund.currentNAV > 0),
      };

      const response = await loanApplicationsAPI.create(submitData);
      if (response.data.success) {
        toast.success('Loan application created successfully!');
        router.push(`/loan-applications/${response.data.data._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create loan application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Loan Application</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.customerInfo.name}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN *</label>
                <input
                  type="text"
                  name="pan"
                  required
                  value={formData.customerInfo.pan}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar *</label>
                <input
                  type="text"
                  name="aadhaar"
                  required
                  value={formData.customerInfo.aadhaar}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.customerInfo.email}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.customerInfo.phone}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  value={formData.customerInfo.address}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Product *</label>
                <select
                  name="loanProductId"
                  required
                  value={formData.loanProductId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requested Amount (₹) *</label>
                <input
                  type="number"
                  name="requestedAmount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.requestedAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (months) *</label>
                <input
                  type="number"
                  name="tenure"
                  required
                  min="1"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Mutual Funds */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mutual Fund Holdings</h2>
              <button
                type="button"
                onClick={addMutualFund}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
              >
                Add Fund
              </button>
            </div>
            {formData.mutualFunds.map((fund, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Fund #{index + 1}</h3>
                  {formData.mutualFunds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMutualFund(index)}
                      className="text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fund Name</label>
                    <input
                      type="text"
                      name="fundName"
                      value={fund.fundName}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Code</label>
                    <input
                      type="text"
                      name="schemeCode"
                      value={fund.schemeCode}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AMC</label>
                    <input
                      type="text"
                      name="amc"
                      value={fund.amc}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Folio Number</label>
                    <input
                      type="text"
                      name="folioNumber"
                      value={fund.folioNumber}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                    <input
                      type="number"
                      name="units"
                      min="0"
                      step="0.01"
                      value={fund.units}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current NAV</label>
                    <input
                      type="number"
                      name="currentNAV"
                      min="0"
                      step="0.01"
                      value={fund.currentNAV}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  {fund.totalValue > 0 && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">
                        Total Value: ₹{fund.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

