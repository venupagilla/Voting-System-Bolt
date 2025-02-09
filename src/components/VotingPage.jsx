import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parties } from "../data/parties";
import { User, X, Fingerprint } from "lucide-react";

export default function VotingPage() {
  const navigate = useNavigate();
  const [voterData, setVoterData] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [showFingerprint, setShowFingerprint] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("voterData");
    if (!data) {
      navigate("/");
      return;
    }
    setVoterData(JSON.parse(data));
  }, [navigate]);

  const handleVote = () => {
    if (selectedParty) {
      setShowFingerprint(true);
    }
  };

  const handleFingerprintAuth = () => {
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setShowFingerprint(false);
      setShowModal(true);

      // Store voting status
      localStorage.removeItem("voterData");
      localStorage.setItem("hasVoted", "true");

      // Show "Thanks for voting" for 7 seconds before resetting
      setTimeout(() => {
        localStorage.setItem("hasVoted", "false"); // Reset voting status
        setShowModal(false);
        navigate("/");
        window.location.reload(); // Ensure a fresh start
      }, 7000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{voterData?.name}</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Selected party details */}
        <div className="flex-1 px-4 py-8">
          {selectedParty ? (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <span className="text-6xl">{selectedParty.symbol}</span>
                <h2 className="text-2xl font-bold mt-4">
                  {selectedParty.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  Representative: {selectedParty.representative}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-700 mb-4">
                  {selectedParty.description}
                </p>
                <h3 className="font-medium mb-3">Key Manifesto Points:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {selectedParty.manifesto.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a party from below to view details</p>
            </div>
          )}
        </div>

        {/* Party selector */}
        <div className="fixed bottom-24 left-0 right-0">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-4 pb-4 min-w-full">
              {parties.map((party) => (
                <div
                  key={party.id}
                  onClick={() => setSelectedParty(party)}
                  className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center ${
                    selectedParty?.id === party.id
                      ? "bg-blue-100 border-4 border-blue-500"
                      : "bg-white border border-gray-200"
                  } shadow-lg cursor-pointer transition-all duration-200`}
                >
                  <span className="text-4xl">{party.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vote button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleVote}
            disabled={!selectedParty}
            className={`w-full py-3 px-4 rounded-full text-white font-medium ${
              selectedParty
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            } transition duration-200`}
          >
            Cast Vote
          </button>
        </div>
      </div>

      {/* Fingerprint Modal */}
      {showFingerprint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm w-full">
            <div
              className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isAuthenticating ? "bg-blue-100 animate-pulse" : "bg-gray-100"
              }`}
              onClick={handleFingerprintAuth}
            >
              <Fingerprint
                className={`w-12 h-12 ${
                  isAuthenticating ? "text-blue-500" : "text-gray-500"
                }`}
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Fingerprint Authentication
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {isAuthenticating
                ? "Authenticating..."
                : "Touch the fingerprint sensor to confirm your vote"}
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Vote Cast Successfully!
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Thank you for participating in the democratic process.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
