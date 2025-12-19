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
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Loan Products</h1>
          {user?.role === 'admin' && (
            <button
              onClick={() => toast.info('Product creation form coming soon')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Add Product
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No loan products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <LoanProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

