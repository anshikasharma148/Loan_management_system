'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/utils';
import { loanProductsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import LoanProductCard from '@/components/LoanProductCard';
import toast from 'react-hot-toast';

export default function LoanProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProducts();
  }, [router, user]);

  const fetchProducts = async () => {
    try {
      const response = await loanProductsAPI.getAll();
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch loan products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2 text-slate-500">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8 animate-slide-down">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Loan Products</h1>
            <p className="text-slate-600">Browse and select from our available loan products</p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => toast.info('Product creation form coming soon')}
              className="px-5 py-2.5 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-accent-700 hover:to-accent-800 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Add Product
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 glass-effect rounded-xl">
            <p className="text-slate-500">No loan products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={product._id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-scale-in">
                <LoanProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

