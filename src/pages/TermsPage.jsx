import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NavbarModern from '../components/NavbarModern';
import FooterModern from '../components/FooterModern';

const TermsPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: August 2026",
      intro: "Welcome to the Canadian International School Tangier (CIST) website. By accessing and using this website, you agree to comply with and be bound by the following Terms of Service. If you do not agree to these terms, please do not use our website.",
      sections: [
        {
          title: "1. Acceptance of Terms",
          paragraphs: [
            "These Terms of Service govern your use of the website located at cistangier.com and any associated services, forms, or portals. By using our website, you confirm that you are at least 18 years of age or are accessing the site under the supervision of a parent or guardian."
          ]
        },
        {
          title: "2. Intellectual Property Rights",
          paragraphs: [
            "All content, materials, images, videos, design elements, text, and logos displayed on this website are the intellectual property of Canadian International School Tangier (CIST) or its content suppliers and are protected by international copyright, trademark, and intellectual property laws.",
            "You may not reproduce, distribute, modify, or republish any content from this website without explicit written permission from CIST."
          ]
        },
        {
          title: "3. User Conduct & Submissions",
          paragraphs: [
            "When using our pre-registration or contact forms, you agree to provide true, accurate, current, and complete information.",
            "You agree not to use the website for any unlawful purpose, to transmit any harmful, threatening, or offensive content, or to attempt to breach the website's security."
          ]
        },
        {
          title: "4. Pre-Registration & Admissions Disclaimer",
          paragraphs: [
            "Submitting a pre-registration form through this website does not guarantee admission or official enrollment at CIST.",
            "Official admission is subject to our standard administrative review, placement tests, interview processes, document verification, and the payment of relevant fees as outlined by our admissions office."
          ]
        },
        {
          title: "5. Limitation of Liability",
          paragraphs: [
            "CIST provides this website on an 'as is' basis and makes no warranties, express or implied, regarding its accuracy, availability, or suitability.",
            "CIST will not be liable for any damages arising from the use or inability to use this website, including but not limited to direct, indirect, incidental, or consequential damages."
          ]
        },
        {
          title: "6. Governing Law",
          paragraphs: [
            "These Terms of Service are governed by and construed in accordance with the laws of the Kingdom of Morocco. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Tangier, Morocco."
          ]
        }
      ]
    },
    fr: {
      title: "Conditions d'Utilisation",
      lastUpdated: "Dernière mise à jour : Août 2026",
      intro: "Bienvenue sur le site Web de l'École Internationale Canadienne de Tanger (CIST). En accédant à ce site Web et en l'utilisant, vous acceptez de vous conformer et d'être lié par les conditions d'utilisation suivantes. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site Web.",
      sections: [
        {
          title: "1. Acceptation des conditions",
          paragraphs: [
            "Ces conditions d'utilisation régissent votre utilisation du site Web situé à cistangier.com et de tout service, formulaire ou portail associé. En utilisant notre site Web, vous confirmez que vous avez au moins 18 ans ou que vous accédez au site sous la surveillance d'un parent ou d'un tuteur."
          ]
        },
        {
          title: "2. Droits de propriété intellectuelle",
          paragraphs: [
            "Tout le contenu, le matériel, les images, les vidéos, les éléments de conception, les textes et les logos affichés sur ce site Web sont la propriété intellectuelle de l'École Internationale Canadienne de Tanger (CIST) ou de ses fournisseurs de contenu et sont protégés par les lois internationales sur le droit d'auteur, les marques et la propriété intellectuelle.",
            "Vous ne pouvez pas reproduire, distribuer, modifier ou republier tout contenu de ce site Web sans l'autorisation écrite explicite de la CIST."
          ]
        },
        {
          title: "3. Conduite de l'utilisateur et soumissions",
          paragraphs: [
            "Lorsque vous utilisez nos formulaires de pré-inscription ou de contact, vous acceptez de fournir des informations véridiques, exactes, à jour et complètes.",
            "Vous acceptez de ne pas utiliser le site Web à des fins illégales, de ne pas transmettre de contenu nuisible, menaçant ou offensant, et de ne pas tenter de violer la sécurité du site Web."
          ]
        },
        {
          title: "4. Avertissement concernant la pré-inscription et les admissions",
          paragraphs: [
            "La soumission d'un formulaire de pré-inscription via ce site Web ne garantit pas l'admission ou l'inscription officielle à la CIST.",
            "L'admission officielle est soumise à notre examen administratif standard, aux tests de niveau, aux processus d'entretien, à la vérification des documents et au paiement des frais correspondants comme indiqué par notre bureau des admissions."
          ]
        },
        {
          title: "5. Limitation de responsabilité",
          paragraphs: [
            "La CIST fournit ce site Web 'en l'état' et ne donne aucune garantie, expresse ou implicite, concernant son exactitude, sa disponibilité ou sa pertinence.",
            "La CIST ne sera pas responsable des dommages découlant de l'utilisation ou de l'incapacité d'utiliser ce site Web, y compris, mais sans s'y limiter, les dommages directs, indirects, accessoires ou consécutifs."
          ]
        },
        {
          title: "6. Droit applicable",
          paragraphs: [
            "Ces conditions d'utilisation sont régies et interprétées conformément aux lois du Royaume du Maroc. Tout litige découlant de ces conditions ou de votre utilisation du site Web sera soumis à la juridiction exclusive des tribunaux de Tanger, Maroc."
          ]
        }
      ]
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última actualización: Agosto 2026",
      intro: "Bienvenido al sitio web de la Escuela Internacional Canadiense de Tánger (CIST). Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes Términos de Servicio. Si no está de acuerdo con estos términos, no utilice nuestro sitio web.",
      sections: [
        {
          title: "1. Aceptación de los Términos",
          paragraphs: [
            "Estos Términos de Servicio rigen el uso del sitio web ubicado en cistangier.com y cualquier servicio, formulario o portal asociado. Al utilizar nuestro sitio web, confirma que tiene al menos 18 años de edad o que accede al sitio bajo la supervisión de un padre o tutor."
          ]
        },
        {
          title: "2. Derechos de Propiedad Intelectual",
          paragraphs: [
            "Todo el contenido, materiales, imágenes, videos, elementos de diseño, texto y logotipos que se muestran en este sitio web son propiedad intelectual de la Escuela Internacional Canadiense de Tánger (CIST) o de sus proveedores de contenido y están protegidos por las leyes internacionales de derechos de autor, marcas registradas y propiedad intelectual.",
            "No puede reproducir, distribuir, modificar o republicar ningún contenido de este sitio web sin el permiso explícito por escrito de la CIST."
          ]
        },
        {
          title: "3. Conducta del Usuario y Envíos",
          paragraphs: [
            "Al utilizar nuestros formularios de preinscripción o contacto, acepta proporcionar información verdadera, precisa, actualizada y completa.",
            "Acepta no utilizar el sitio web para ningún propósito ilegal, no transmitir ningún contenido dañino, amenazante u ofensivo, y no intentar violar la seguridad del sitio web."
          ]
        },
        {
          title: "4. Descargo de Responsabilidad de Preinscripción y Admisiones",
          paragraphs: [
            "El envío de un formulario de preinscripción a través de este sitio web no garantiza la admisión o inscripción oficial en la CIST.",
            "La admisión oficial está sujeta a nuestra revisión administrativa estándar, pruebas de ubicación, procesos de entrevista, verificación de documentos y al pago de las tarifas correspondientes según lo establecido por nuestra oficina de admisiones."
          ]
        },
        {
          title: "5. Limitación de Responsabilidad",
          paragraphs: [
            "La CIST proporciona este sitio web 'tal cual' y no ofrece garantías, expresas o implícitas, con respecto a su precisión, disponibilidad o idoneidad.",
            "La CIST no será responsable de ningún daño derivado del uso o la imposibilidad de usar este sitio web, incluidos, entre otros, daños directos, indirectos, incidentales o consecuentes."
          ]
        },
        {
          title: "6. Ley Aplicable",
          paragraphs: [
            "Estos Términos de Servicio se rigen e interpretan de acuerdo con las leyes del Reino de Marruecos. Cualquier disputa que surja de estos términos o de su uso del sitio web estará sujeta a la jurisdicción exclusiva de los tribunales de Tánger, Marruecos."
          ]
        }
      ]
    }
  };

  const currentContent = content[currentLang] || content.en;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
      <NavbarModern scrolled={true} />
      
      {/* Top spacing header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)',
        padding: 'clamp(6rem, 12vh, 8rem) 1rem 3rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          marginBottom: '0.5rem',
          fontFamily: '"Times New Roman", Times, serif'
        }}>
          {currentContent.title}
        </h1>
        <p style={{ opacity: 0.7, fontSize: '0.9rem', fontFamily: '"Times New Roman", Times, serif' }}>{currentContent.lastUpdated}</p>
      </div>

      {/* Main Content Container */}
      <div className="container" style={{
        flex: 1,
        maxWidth: '800px',
        margin: '3rem auto',
        padding: '0 1rem',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 5vw, 3rem)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          lineHeight: 1.8,
          color: '#444',
          fontFamily: '"Times New Roman", Times, serif'
        }}>
          <p style={{ fontSize: '1.05rem', color: '#666', marginBottom: '2rem' }}>
            {currentContent.intro}
          </p>

          {currentContent.sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: '1rem',
                borderBottom: '2px solid #f0f0f0',
                paddingBottom: '0.5rem'
              }}>
                {section.title}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} style={{ marginBottom: '1rem' }}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <FooterModern />
    </div>
  );
};

export default TermsPage;
