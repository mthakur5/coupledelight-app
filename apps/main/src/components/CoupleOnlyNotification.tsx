"use client";

import { useState, useEffect } from "react";

export default function CoupleOnlyNotification() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check if user has seen the notification before
    const hasSeenNotification = localStorage.getItem("coupleOnlyNotificationSeen");
    
    if (!hasSeenNotification) {
      // Show notification after a brief delay
      setTimeout(() => {
        setShowNotification(true);
      }, 500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("coupleOnlyNotificationSeen", "true");
    setShowNotification(false);
  };

  const handleDecline = () => {
    // Redirect to a safe page or show message
    window.location.href = "https://www.google.com";
  };

  if (!showNotification) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border-2 border-rose-500/50 p-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">👫👫</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Couples Only Community
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4 text-rose-100 mb-8">
            <p className="text-lg font-semibold">
              Welcome to CoupleDelight!
            </p>
            <p className="text-sm leading-relaxed">
              This platform is exclusively designed for <span className="text-rose-400 font-semibold">couples</span> who are:
            </p>
            <ul className="text-left space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✓</span>
                <span>Looking to connect with other adventurous couples</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✓</span>
                <span>Exploring the cuckold lifestyle together</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✓</span>
                <span>Shopping for premium adult toys and products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400">✓</span>
                <span>18 years or older (both partners)</span>
              </li>
            </ul>
            
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mt-6">
              <p className="text-sm">
                <span className="font-semibold text-rose-400">Important:</span> By continuing, you confirm that you are part of a couple and meet all the requirements above.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDecline}
              className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Exit
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-r from-rose-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-purple-700 transition-all shadow-lg shadow-rose-500/50"
            >
              I&apos;m a Couple - Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}