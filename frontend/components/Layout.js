'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser, clearAuth } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/loan-products', label: 'Loan Products' },
    { href: '/loan-applications', label: 'Loan Applications' },
    { href: '/loan-applications/new', label: 'New Application' },
    { href: '/ongoing-loans', label: 'Ongoing Loans' },
    { href: '/collaterals', label: 'Collaterals' },
    { href: '/api-docs', label: 'API Docs' },
  ];

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <nav className="glass-effect sticky top-0 z-50 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-accent-600">LAMF LMS</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      pathname === item.href
                        ? 'bg-accent-50 text-accent-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-accent-200 shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {user.role === 'admin' ? 'Admin' : user.role === 'loan_officer' ? 'Officer' : 'User'}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}

