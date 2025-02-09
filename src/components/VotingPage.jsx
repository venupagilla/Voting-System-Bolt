import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parties } from "../data/parties";
import { User, X } from "lucide-react";

export default function VotingPage() {
  const navigate = useNavigate();
  const [voterData, setVoterData] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("voterData");
    if (!data) {
      navigate("/");
      return;
    }
    setVoterData(JSON.parse(data));
  }, [navigate]);

  const handleVote = async () => {
    if (!selectedParty || !voterData?.id) {
      alert("❌ Missing voter data or party selection.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId: voterData.id, candidate: selectedParty.name }), // Ensure correct key names
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Vote cast successfully!");
        localStorage.removeItem("voterData");
        localStorage.setItem("hasVoted", "true");
        navigate("/");
      } else {
        alert(`❌ ${result.error || "An error occurred while voting."}`);
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("❌ Unable to connect to the voting server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{voterData?.name || "Unknown Voter"}</span>
          </div>
          <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 py-8">
          {selectedParty ? (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <span className="text-6xl">{selectedParty.symbol}</span>
                <h2 className="text-2xl font-bold mt-4">{selectedParty.name}</h2>
                <p className="text-gray-600 mt-2">Representative: {selectedParty.representative}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-700 mb-4">{selectedParty.description}</p>
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
    </div>
  );
}
