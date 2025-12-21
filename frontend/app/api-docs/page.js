'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/utils';
import Layout from '@/components/Layout';

export default function APIDocsPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://loan-management-system-pxkz.onrender.com/api';

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold gradient-text mb-2">API Documentation</h1>
          <p className="text-slate-600">Complete API reference for fintech integration</p>
        </div>

        <div className="glass-effect rounded-xl p-8 space-y-8 animate-slide-up">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Overview</h2>
            <p className="text-slate-700 mb-4 leading-relaxed">
              The LAMF LMS API provides RESTful endpoints for fintech companies to integrate loan application creation.
              All API requests require JWT authentication.
            </p>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <p className="font-mono text-sm text-slate-800">Base URL: <span className="text-accent-600 font-semibold">{apiBaseUrl}</span></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Authentication</h2>
            <p className="text-slate-700 mb-4 leading-relaxed">
              To use the API, you need to authenticate and obtain a JWT token. Include this token in the Authorization header of all requests.
            </p>
            
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg mb-4">
              <h3 className="font-bold text-slate-900 mb-3">1. API Client Login</h3>
              <p className="text-sm font-semibold text-accent-600 mb-2">POST /api/auth/api-login</p>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
{`{
  "clientId": "fintech_client_001",
  "clientSecret": "fintech_secret_123"
}`}
              </pre>
              <p className="text-sm font-semibold text-slate-700 mt-3 mb-2">Response:</p>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
{`{
  "success": true,
  "data": {
    "client": {
      "id": "...",
      "clientName": "Fintech Partner 1",
      "clientId": "fintech_client_001"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`}
              </pre>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-3">2. Using the Token</h3>
              <p className="text-sm font-semibold text-slate-700 mb-2">Include the token in the Authorization header:</p>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
{`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Create Loan Application</h2>
            <p className="text-slate-700 mb-4 leading-relaxed">
              Create a new loan application via API. This endpoint is specifically designed for fintech partners.
            </p>
            
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-3">POST /api/loan-applications/api</h3>
              <p className="text-sm font-semibold text-slate-700 mb-2">Headers:</p>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto mb-4 border border-slate-700">
{`Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json`}
              </pre>
              
              <p className="text-sm font-semibold text-slate-700 mb-2">Request Body:</p>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
{`{
  "customerInfo": {
    "name": "John Doe",
    "pan": "ABCDE1234F",
    "aadhaar": "123456789012",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, City, State 123456"
  },
  "loanProductId": "PRODUCT_ID_HERE",
  "requestedAmount": 500000,
  "tenure": 24,
  "mutualFunds": [
    {
      "fundName": "HDFC Equity Fund",
      "schemeCode": "HDFC001",
      "amc": "HDFC Mutual Fund",
      "folioNumber": "FOL001",
      "units": 1000,
      "currentNAV": 550,
      "totalValue": 550000
    }
  ]
}`}
              </pre>

              <p className="text-sm font-semibold text-slate-700 mt-4 mb-2">Success Response (201):</p>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
{`{
  "success": true,
  "data": {
    "_id": "...",
    "applicationNumber": "LAMF12345678",
    "customerInfo": {...},
    "calculatedLTV": 52.63,
    "interestRate": 11.2,
    "status": "pending",
    ...
  },
  "message": "Loan application created successfully"
}`}
              </pre>

              <p className="text-sm font-semibold text-slate-700 mt-4 mb-2">Error Response (400):</p>
              <pre className="bg-slate-900 text-rose-400 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
{`{
  "success": false,
  "error": "LTV ratio 85.50% is outside the allowed range (50% - 80%)"
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Other Available Endpoints</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-accent-500 pl-4 py-2 bg-accent-50/50 rounded-r-lg">
                <h3 className="font-bold text-slate-900">GET /api/loan-products</h3>
                <p className="text-sm text-slate-600">Get all active loan products</p>
              </div>
              <div className="border-l-4 border-accent-500 pl-4 py-2 bg-accent-50/50 rounded-r-lg">
                <h3 className="font-bold text-slate-900">GET /api/loan-applications/:id</h3>
                <p className="text-sm text-slate-600">Get loan application details</p>
              </div>
              <div className="border-l-4 border-accent-500 pl-4 py-2 bg-accent-50/50 rounded-r-lg">
                <h3 className="font-bold text-slate-900">GET /api/loan-applications/ongoing</h3>
                <p className="text-sm text-slate-600">Get all ongoing loans</p>
              </div>
              <div className="border-l-4 border-accent-500 pl-4 py-2 bg-accent-50/50 rounded-r-lg">
                <h3 className="font-bold text-slate-900">GET /api/collaterals</h3>
                <p className="text-sm text-slate-600">Get all collaterals (with optional filters)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Response Format</h2>
            <p className="text-slate-700 mb-4 leading-relaxed">All API responses follow a consistent format:</p>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
{`{
  "success": true/false,
  "data": {...},
  "message": "Success message",
  "error": "Error message if any"
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Error Codes</h2>
            <ul className="list-disc list-inside space-y-3 text-slate-700">
              <li className="font-semibold"><span className="text-accent-600">400</span> - Bad Request (validation errors, invalid data)</li>
              <li className="font-semibold"><span className="text-accent-600">401</span> - Unauthorized (missing or invalid token)</li>
              <li className="font-semibold"><span className="text-accent-600">403</span> - Forbidden (insufficient permissions)</li>
              <li className="font-semibold"><span className="text-accent-600">404</span> - Not Found (resource doesn't exist)</li>
              <li className="font-semibold"><span className="text-accent-600">500</span> - Internal Server Error</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
}

