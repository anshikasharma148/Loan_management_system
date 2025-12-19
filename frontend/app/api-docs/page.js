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

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">API Documentation</h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-700 mb-4">
              The LAMF LMS API provides RESTful endpoints for fintech companies to integrate loan application creation.
              All API requests require JWT authentication.
            </p>
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-mono text-sm">Base URL: {apiBaseUrl}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
            <p className="text-gray-700 mb-4">
              To use the API, you need to authenticate and obtain a JWT token. Include this token in the Authorization header of all requests.
            </p>
            
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h3 className="font-semibold mb-2">1. API Client Login</h3>
              <p className="text-sm text-gray-600 mb-2">POST /api/auth/api-login</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`{
  "clientId": "fintech_client_001",
  "clientSecret": "fintech_secret_123"
}`}
              </pre>
              <p className="text-sm text-gray-600 mt-2">Response:</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
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

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">2. Using the Token</h3>
              <p className="text-sm text-gray-600 mb-2">Include the token in the Authorization header:</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Create Loan Application</h2>
            <p className="text-gray-700 mb-4">
              Create a new loan application via API. This endpoint is specifically designed for fintech partners.
            </p>
            
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">POST /api/loan-applications/api</h3>
              <p className="text-sm text-gray-600 mb-2">Headers:</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto mb-4">
{`Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json`}
              </pre>
              
              <p className="text-sm text-gray-600 mb-2">Request Body:</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
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

              <p className="text-sm text-gray-600 mt-4 mb-2">Success Response (201):</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
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

              <p className="text-sm text-gray-600 mt-4 mb-2">Error Response (400):</p>
              <pre className="bg-gray-800 text-red-400 p-4 rounded text-sm overflow-x-auto">
{`{
  "success": false,
  "error": "LTV ratio 85.50% is outside the allowed range (50% - 80%)"
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Other Available Endpoints</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold">GET /api/loan-products</h3>
                <p className="text-sm text-gray-600">Get all active loan products</p>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold">GET /api/loan-applications/:id</h3>
                <p className="text-sm text-gray-600">Get loan application details</p>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold">GET /api/loan-applications/ongoing</h3>
                <p className="text-sm text-gray-600">Get all ongoing loans</p>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold">GET /api/collaterals</h3>
                <p className="text-sm text-gray-600">Get all collaterals (with optional filters)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Response Format</h2>
            <p className="text-gray-700 mb-4">All API responses follow a consistent format:</p>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
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
            <h2 className="text-2xl font-semibold mb-4">Error Codes</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>400</strong> - Bad Request (validation errors, invalid data)</li>
              <li><strong>401</strong> - Unauthorized (missing or invalid token)</li>
              <li><strong>403</strong> - Forbidden (insufficient permissions)</li>
              <li><strong>404</strong> - Not Found (resource doesn't exist)</li>
              <li><strong>500</strong> - Internal Server Error</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
}

