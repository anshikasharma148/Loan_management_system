import Link from 'next/link';

export default function LoanProductCard({ product }) {
  return (
    <div className="glass-effect rounded-xl p-6 card-hover animate-scale-in">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
        {product.isActive ? (
          <span className="px-3 py-1 text-xs font-semibold bg-accent-50 text-accent-700 rounded-full border border-accent-200">
            Active
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
            Inactive
          </span>
        )}
      </div>
      
      {product.description && (
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">{product.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-slate-50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">LTV Range</p>
          <p className="text-lg font-bold text-slate-900">{product.minLTV}% - {product.maxLTV}%</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Interest Rate</p>
          <p className="text-lg font-bold text-slate-900">{product.minInterestRate}% - {product.maxInterestRate}%</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Loan Amount</p>
          <p className="text-sm font-bold text-slate-900">
            ₹{product.minLoanAmount.toLocaleString('en-IN')} - ₹{product.maxLoanAmount.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Tenure</p>
          <p className="text-lg font-bold text-slate-900">{product.tenureOptions.join(', ')} months</p>
        </div>
      </div>

      {product.eligibilityCriteria && (
        <div className="mb-6 p-3 rounded-lg bg-accent-50 border border-accent-100">
          <p className="text-xs font-semibold text-accent-700 uppercase tracking-wide mb-1">Eligibility</p>
          <p className="text-sm text-slate-700">{product.eligibilityCriteria}</p>
        </div>
      )}

      <Link
        href={`/loan-applications/new?productId=${product._id}`}
        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-accent-700 hover:to-accent-800 transition-all duration-300 transform hover:-translate-y-0.5"
      >
        Apply Now
      </Link>
    </div>
  );
}

