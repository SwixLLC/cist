import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSite, whatsappHref } from '../lib/siteContent';

const WhatsAppButton = () => {
  const { settings } = useSite();
  return (
    <a
      className="lp-whatsapp"
      href={whatsappHref(settings.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={30} color="white" fill="white" />
    </a>
  );
};

export default WhatsAppButton;
