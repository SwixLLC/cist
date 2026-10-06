import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, AlertTriangle } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          backgroundColor: 'var(--canadian-red-wash)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <AlertTriangle size={50} color="var(--canadian-red)" />
        </div>
        
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 700, 
          marginBottom: '0.5rem', 
          color: 'var(--canadian-red)',
          fontFamily: 'Playfair Display, serif'
        }}>
          404
        </h1>
        
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 600, 
          marginBottom: '1rem', 
          color: '#1a1a1a' 
        }}>
          Page Not Found
        </h2>
        
        <p style={{ 
          color: '#666', 
          marginBottom: '2rem', 
          lineHeight: 1.6 
        }}>
          Sorry, the page you are looking for does not exist. 
          It might have been moved or deleted.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            className="hv-lift"
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, var(--canadian-red) 0%, var(--canadian-red-dark) 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '50px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <Home size={20} />
            Back to Home
          </button>

          <button
            className="hv-wash"
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--canadian-red)',
              padding: '1rem 2rem',
              borderRadius: '50px',
              border: '2px solid var(--canadian-red)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default NotFoundPage;
