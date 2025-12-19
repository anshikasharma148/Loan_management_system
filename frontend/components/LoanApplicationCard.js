import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function LoanApplicationCard({ application }) {
  return (
    <Link href={`/loan-applications/${application._id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {application.customerInfo?.name || 'N/A'}
            </h3>
            <p className="text-sm text-gray-500">App #: {application.applicationNumber}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Requested Amount</p>
            <p className="text-lg font-semibold">{formatCurrency(application.requestedAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">LTV Ratio</p>
            <p className="text-lg font-semibold">{application.calculatedLTV?.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Interest Rate</p>
            <p className="text-lg font-semibold">{application.interestRate?.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tenure</p>
            <p className="text-lg font-semibold">{application.tenure} months</p>
          </div>
        </div>

        {application.loanProductId && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Product</p>
            <p className="text-sm font-medium">
              {typeof application.loanProductId === 'object' 
                ? application.loanProductId.name 
                : 'N/A'}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Created: {formatDate(application.createdAt)}</span>
          {application.disbursedDate && (
            <span>Disbursed: {formatDate(application.disbursedDate)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

