'use client';

import React from 'react';
import { PopupButton } from '@typeform/embed-react';

interface WaitlistModalProps {
  typeformId: string;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ typeformId }) => {
  return (
    <PopupButton
      id={typeformId}
      className="w-full"
    >
      Join the Waitlist
    </PopupButton>
  );
};

export default WaitlistModal;
