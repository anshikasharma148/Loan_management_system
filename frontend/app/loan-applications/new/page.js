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
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold gradient-text mb-2">Create New Loan Application</h1>
          <p className="text-slate-600">Fill in the details to create a new loan application</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-8 space-y-8 animate-slide-up">
          {/* Customer Information */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.customerInfo.name}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">PAN *</label>
                <input
                  type="text"
                  name="pan"
                  required
                  value={formData.customerInfo.pan}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Aadhaar *</label>
                <input
                  type="text"
                  name="aadhaar"
                  required
                  value={formData.customerInfo.aadhaar}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.customerInfo.email}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.customerInfo.phone}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  value={formData.customerInfo.address}
                  onChange={(e) => handleInputChange(e, 'customerInfo')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">Loan Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Loan Product *</label>
                <select
                  name="loanProductId"
                  required
                  value={formData.loanProductId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Requested Amount (₹) *</label>
                <input
                  type="number"
                  name="requestedAmount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.requestedAmount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tenure (months) *</label>
                <input
                  type="number"
                  name="tenure"
                  required
                  min="1"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Mutual Funds */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Mutual Fund Holdings</h2>
              <button
                type="button"
                onClick={addMutualFund}
                className="px-5 py-2.5 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-accent-700 hover:to-accent-800 transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
              >
                + Add Fund
              </button>
            </div>
            {formData.mutualFunds.map((fund, index) => (
              <div key={index} className="border border-slate-200 rounded-xl p-6 mb-4 bg-slate-50/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900">Fund #{index + 1}</h3>
                  {formData.mutualFunds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMutualFund(index)}
                      className="px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Fund Name</label>
                    <input
                      type="text"
                      name="fundName"
                      value={fund.fundName}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Scheme Code</label>
                    <input
                      type="text"
                      name="schemeCode"
                      value={fund.schemeCode}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">AMC</label>
                    <input
                      type="text"
                      name="amc"
                      value={fund.amc}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Folio Number</label>
                    <input
                      type="text"
                      name="folioNumber"
                      value={fund.folioNumber}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Units</label>
                    <input
                      type="number"
                      name="units"
                      min="0"
                      step="0.01"
                      value={fund.units}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current NAV</label>
                    <input
                      type="number"
                      name="currentNAV"
                      min="0"
                      step="0.01"
                      value={fund.currentNAV}
                      onChange={(e) => handleInputChange(e, 'mutualFunds', index)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all bg-white text-slate-900"
                    />
                  </div>
                  {fund.totalValue > 0 && (
                    <div className="md:col-span-2 p-3 rounded-lg bg-accent-50 border border-accent-200">
                      <p className="text-sm font-semibold text-accent-700">
                        Total Value: ₹{fund.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-accent-700 hover:to-accent-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

