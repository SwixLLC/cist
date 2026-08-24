import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NavbarModern from '../components/NavbarModern';
import FooterModern from '../components/FooterModern';

const PrivacyPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: August 2026",
      intro: "Canadian International School Tangier (CIST) is committed to protecting the privacy and personal data of our students, parents, and visitors. This Privacy Policy describes how we collect, use, and safeguard your personal information when you visit our website and use our pre-registration or contact services.",
      sections: [
        {
          title: "1. Information We Collect",
          paragraphs: [
            "We collect personal information that you voluntarily provide to us when you fill out the pre-registration form, contact forms, or subscribe to our newsletter.",
            "This information may include: student's full name, date of birth, grade applying for, parents' full names, email addresses, phone and WhatsApp numbers, and any other details you choose to share."
          ]
        },
        {
          title: "2. How We Use Your Information",
          paragraphs: [
            "We use the collected information to: process pre-registration applications, respond to your inquiries, schedule school tours, send updates regarding the school, and improve our website's functionality.",
            "Your information is stored securely and is only accessible by authorized school administrative staff."
          ]
        },
        {
          title: "3. Data Security & Protection",
          paragraphs: [
            "We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.",
            "We do not sell, trade, or rent your personal identification information to third parties."
          ]
        },
        {
          title: "4. Cookies",
          paragraphs: [
            "Our website may use 'cookies' to enhance the user experience. Your web browser places cookies on your hard drive for record-keeping purposes and sometimes to track information about your visit. You can choose to set your web browser to refuse cookies, though some parts of the site may not function properly."
          ]
        },
        {
          title: "5. Your Rights",
          paragraphs: [
            "You have the right to request access to the personal data we hold about you, request corrections to any inaccuracies, or request the deletion of your personal data. Please contact us using the details below to exercise these rights."
          ]
        },
        {
          title: "6. Contact Us",
          paragraphs: [
            "If you have any questions about this Privacy Policy, please contact our admissions office at admissions@cistangier.com or visit our campus."
          ]
        }
      ]
    },
    fr: {
      title: "Politique de Confidentialité",
      lastUpdated: "Dernière mise à jour : Août 2026",
      intro: "L'École Internationale Canadienne de Tanger (CIST) s'engage à protéger la vie privée et les données personnelles de nos élèves, parents et visiteurs. Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous visitez notre site Web et utilisez nos services de pré-inscription ou de contact.",
      sections: [
        {
          title: "1. Informations que nous collectons",
          paragraphs: [
            "Nous collectons les informations personnelles que vous nous fournissez volontairement lorsque vous remplissez le formulaire de pré-inscription, les formulaires de contact ou que vous vous abonnez à notre newsletter.",
            "Ces informations peuvent inclure : le nom complet de l'élève, sa date de naissance, le niveau d'études demandé, le nom complet des parents, les adresses e-mail, les numéros de téléphone et de WhatsApp, et tout autre détail que vous choisissez de partager."
          ]
        },
        {
          title: "2. Comment nous utilisons vos informations",
          paragraphs: [
            "Nous utilisons les informations collectées pour : traiter les demandes de pré-inscription, répondre à vos demandes, planifier des visites de l'école, envoyer des mises à jour concernant l'école et améliorer le fonctionnement de notre site Web.",
            "Vos informations sont stockées en toute sécurité et ne sont accessibles qu'au personnel administratif autorisé de l'école."
          ]
        },
        {
          title: "3. Sécurité et protection des données",
          paragraphs: [
            "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, altération, divulgation ou destruction.",
            "Nous ne vendons, n'échangeons ni ne louons vos informations d'identification personnelle à des tiers."
          ]
        },
        {
          title: "4. Cookies",
          paragraphs: [
            "Notre site Web peut utiliser des 'cookies' pour améliorer l'expérience utilisateur. Votre navigateur Web place des cookies sur votre disque dur à des fins d'archivage et parfois pour suivre les informations sur votre visite. Vous pouvez choisir de configurer votre navigateur Web pour refuser les cookies, bien que certaines parties du site puissent ne pas fonctionner correctement."
          ]
        },
        {
          title: "5. Vos droits",
          paragraphs: [
            "Vous avez le droit de demander l'accès aux données personnelles que nous détenons à votre sujet, de demander la correction de toute inexactitude ou de demander la suppression de vos données personnelles. Veuillez nous contacter en utilisant les coordonnées ci-dessous pour exercer ces droits."
          ]
        },
        {
          title: "6. Contactez-nous",
          paragraphs: [
            "Si vous avez des questions concernant cette politique de confidentialité, veuillez contacter notre bureau des admissions à admissions@cistangier.com ou visiter notre campus."
          ]
        }
      ]
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización: Agosto 2026",
      intro: "La Escuela Internacional Canadiense de Tánger (CIST) se compromete a proteger la privacidad y los datos personales de nuestros estudiantes, padres y visitantes. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información personal cuando visita nuestro sitio web y utiliza nuestros servicios de preinscripción o contacto.",
      sections: [
        {
          title: "1. Información que recopilamos",
          paragraphs: [
            "Recopilamos información personal que nos proporciona voluntariamente cuando completa el formulario de preinscripción, los formularios de contacto o se suscribe a nuestro boletín.",
            "Esta información puede incluir: nombre completo del estudiante, fecha de nacimiento, grado al que aplica, nombres completos de los padres, direcciones de correo electrónico, números de teléfono y WhatsApp, y cualquier otro detalle que decida compartir."
          ]
        },
        {
          title: "2. Cómo utilizamos su información",
          paragraphs: [
            "Utilizamos la información recopilada para: procesar solicitudes de preinscripción, responder a sus consultas, programar visitas escolares, enviar actualizaciones sobre la escuela y mejorar la funcionalidad de nuestro sitio web.",
            "Su información se almacena de forma segura y solo es accesible para el personal administrativo escolar autorizado."
          ]
        },
        {
          title: "3. Seguridad y protección de datos",
          paragraphs: [
            "Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger sus datos personales contra el acceso no autorizado, alteración, divulgación o destrucción.",
            "No vendemos, comercializamos ni alquilamos su información de identificación personal a terceros."
          ]
        },
        {
          title: "4. Cookies",
          paragraphs: [
            "Nuestro sitio web puede utilizar 'cookies' para mejorar la experiencia del usuario. Su navegador web coloca cookies en su disco duro para el mantenimiento de registros y, a veces, para rastrear información sobre su visita. Puede optar por configurar su navegador web para rechazar cookies, aunque algunas partes del sitio pueden no funcionar correctamente."
          ]
        },
        {
          title: "5. Sus derechos",
          paragraphs: [
            "Tiene derecho a solicitar el acceso a los datos personales que tenemos sobre usted, solicitar correcciones de cualquier inexactitud o solicitar la eliminación de sus datos personales. Póngase en contacto con nosotros utilizando los detalles a continuación para ejercer estos derechos."
          ]
        },
        {
          title: "6. Contáctenos",
          paragraphs: [
            "Si tiene alguna pregunta sobre esta Política de Privacidad, comuníquese con nuestra oficina de admisiones en admissions@cistangier.com o visite nuestro campus."
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
          fontFamily: 'Playfair Display, serif'
        }}>
          {currentContent.title}
        </h1>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{currentContent.lastUpdated}</p>
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
          color: '#444'
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

export default PrivacyPage;
