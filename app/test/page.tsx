'use client';

import { useState } from 'react';

export default function TestNotificationPage() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testTrigger = async () => {
    if (!token) {
      setStatus('Please enter the device token first.');
      return;
    }

    setLoading(true);
    setStatus('Sending...');

    try {
      const response = await fetch('/api/test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          title: 'Uninvited Delivery!',
          body: 'A delivery boy is waiting at the gate. Accept or Decline?',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus(`Success! Message ID: ${data.messageId}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatus(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F5] p-6 text-[#1A1A1A] font-sans">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E1E3E4] max-w-lg w-full">
        <h1 className="text-2xl font-bold text-[#191C1D] mb-2">Gate Security Simulator</h1>
        <p className="text-sm text-[#4A5568] mb-6">
          Paste your Android devices FCM token below to simulate a delivery arriving at the gate.
        </p>

        <div className="mb-4">
          <label className="block text-xs font-bold text-[#191C1D] uppercase tracking-wider mb-2">
            Device FCM Token
          </label>
          <textarea 
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border border-[#C1C7D3] rounded-md p-3 text-sm focus:border-[#005DA7] focus:ring-1 focus:ring-[#005DA7] outline-none transition-all"
            rows={4}
            placeholder="e.g. fAkE_tOkEn_..._123"
          />
        </div>

        <button 
          onClick={testTrigger}
          disabled={loading}
          className="w-full bg-[#005DA7] hover:bg-[#2976C7] text-white font-medium py-3 rounded-md transition-all shadow-sm disabled:opacity-50"
        >
          {loading ? 'Triggering...' : 'Test Notification (Delivery Boy arrived)'}
        </button>

        {status && (
          <div className={`mt-4 p-3 rounded-md text-sm ${status.includes('Error') || status.includes('Please') ? 'bg-[#FFDAD6] text-[#BA1A1A]' : 'bg-[#D8F3DC] text-[#2D6A4F]'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
