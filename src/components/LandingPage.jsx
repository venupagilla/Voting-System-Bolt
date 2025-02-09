import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const hasVoted = localStorage.getItem('hasVoted') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-white text-center">
        {hasVoted ? (
          <>
            <CheckCircle className="w-24 h-24 mb-6 text-green-300" />
            <h1 className="text-4xl font-bold mb-4">Thank You for Voting!</h1>
            <p className="text-xl text-blue-100 mb-8">
              Your vote has been successfully recorded. Every vote counts in strengthening our democracy.
            </p>
          </>
        ) : (
          <>
            <Vote className="w-24 h-24 mb-6" />
            <h1 className="text-4xl font-bold mb-4">Digital Voting System</h1>
            <p className="text-xl text-blue-100 mb-8">
              Exercise your right to vote securely and efficiently
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-200 shadow-lg"
            >
              Start Voting Process
            </button>
          </>
        )}
      </div>
      
      <div className="p-8 bg-blue-600 text-center">
        <h2 className="text-xl font-semibold text-white mb-4">Key Features</h2>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-blue-500 bg-opacity-50 p-4 rounded-lg text-white">
            <h3 className="font-medium mb-2">Secure</h3>
            <p className="text-sm text-blue-100">Biometric verification for enhanced security</p>
          </div>
          <div className="bg-blue-500 bg-opacity-50 p-4 rounded-lg text-white">
            <h3 className="font-medium mb-2">Fast</h3>
            <p className="text-sm text-blue-100">Quick and efficient voting process</p>
          </div>
          <div className="bg-blue-500 bg-opacity-50 p-4 rounded-lg text-white">
            <h3 className="font-medium mb-2">Transparent</h3>
            <p className="text-sm text-blue-100">Clear information about all parties</p>
          </div>
          <div className="bg-blue-500 bg-opacity-50 p-4 rounded-lg text-white">
            <h3 className="font-medium mb-2">Accessible</h3>
            <p className="text-sm text-blue-100">Easy to use mobile interface</p>
          </div>
        </div>
      </div>
    </div>
  );
}
