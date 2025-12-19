import { getStatusColor, getPledgeStatusColor } from '@/lib/utils';

export function StatusBadge({ status, type = 'application' }) {
  const colorClass = type === 'pledge' 
    ? getPledgeStatusColor(status)
    : getStatusColor(status);

  const displayStatus = status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {displayStatus}
    </span>
  );
}

