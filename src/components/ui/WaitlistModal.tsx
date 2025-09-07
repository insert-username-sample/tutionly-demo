'use client';

import { useEffect } from 'react';

const WaitlistModal: React.FC = () => {
  useEffect(() => {
    window.location.href = 'https://form.typeform.com/to/joPRdzLJ';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Redirecting to Waitlist...</h2>
        <p className="text-sm text-gray-600">Please wait...</p>
      </div>
    </div>
  );
};

export default WaitlistModal;
