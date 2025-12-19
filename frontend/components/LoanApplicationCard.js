import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function LoanApplicationCard({ application }) {
  return (
    <Link href={`/loan-applications/${application._id}`}>
      <div className="glass-effect rounded-xl p-6 card-hover cursor-pointer group animate-scale-in">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-accent-600 transition-colors">
              {application.customerInfo?.name || 'N/A'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">#{application.applicationNumber}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-slate-50">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Amount</p>
            <p className="text-base font-bold text-slate-900">{formatCurrency(application.requestedAmount)}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">LTV</p>
            <p className="text-base font-bold text-slate-900">{application.calculatedLTV?.toFixed(2)}%</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Rate</p>
            <p className="text-base font-bold text-slate-900">{application.interestRate?.toFixed(2)}%</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Tenure</p>
            <p className="text-base font-bold text-slate-900">{application.tenure} mo</p>
          </div>
        </div>

        {application.loanProductId && (
          <div className="mb-4 p-2 rounded-lg bg-accent-50 border border-accent-100">
            <p className="text-xs font-semibold text-accent-700 uppercase tracking-wide mb-1">Product</p>
            <p className="text-sm font-medium text-slate-700">
              {typeof application.loanProductId === 'object' 
                ? application.loanProductId.name 
                : 'N/A'}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500">Created {formatDate(application.createdAt)}</span>
          {application.disbursedDate && (
            <span className="text-xs text-accent-600 font-medium">Disbursed</span>
          )}
        </div>
      </div>
    </Link>
  );
}

