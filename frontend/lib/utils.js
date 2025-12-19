export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    under_review: 'bg-accent-50 text-accent-700 border border-accent-200',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
    disbursed: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    closed: 'bg-slate-100 text-slate-700 border border-slate-200',
  };
  return colors[status] || 'bg-slate-100 text-slate-700 border border-slate-200';
};

export const getPledgeStatusColor = (status) => {
  const colors = {
    pledged: 'bg-rose-50 text-rose-700 border border-rose-200',
    unpledged: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    released: 'bg-slate-100 text-slate-700 border border-slate-200',
  };
  return colors[status] || 'bg-slate-100 text-slate-700 border border-slate-200';
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setAuth = (user, token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

