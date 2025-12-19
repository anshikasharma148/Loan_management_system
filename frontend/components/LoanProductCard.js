import Link from 'next/link';

export default function LoanProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
        {product.isActive ? (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Active
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Inactive
          </span>
        )}
      </div>
      
      {product.description && (
        <p className="text-gray-600 mb-4">{product.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">LTV Range</p>
          <p className="text-lg font-semibold">{product.minLTV}% - {product.maxLTV}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Interest Rate</p>
          <p className="text-lg font-semibold">{product.minInterestRate}% - {product.maxInterestRate}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Loan Amount</p>
          <p className="text-lg font-semibold">
            ₹{product.minLoanAmount.toLocaleString('en-IN')} - ₹{product.maxLoanAmount.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tenure Options</p>
          <p className="text-lg font-semibold">{product.tenureOptions.join(', ')} months</p>
        </div>
      </div>

      {product.eligibilityCriteria && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Eligibility</p>
          <p className="text-sm text-gray-700">{product.eligibilityCriteria}</p>
        </div>
      )}

      <Link
        href={`/loan-applications/new?productId=${product._id}`}
        className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        Apply Now
      </Link>
    </div>
  );
}

