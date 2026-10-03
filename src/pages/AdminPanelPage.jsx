import React, { useState, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Plus, Trash2, Edit3,
  Check, Copy, LogOut, Lock, Mail, AlertCircle, RefreshCw, 
  Calendar, FileText, ArrowLeft, X, Eye
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { 
  getNews, saveNews, deleteNews,
  getEvents, saveEvent, deleteEvent,
  getGallery, saveGalleryItem, deleteGalleryItem,
  uploadImage, listUploadedImages, deleteUploadedImage,
  STORAGE_BUCKET
} from '../lib/cmsData';

export default function AdminPanelPage() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('media'); // 'media' | 'news' | 'events' | 'gallery'

  // Data states
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');

  const [newsList, setNewsList] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [showNewsModal, setShowNewsModal] = useState(false);

  const [eventsList, setEventsList] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', title: '', time: 'All Day' });

  const [galleryList, setGalleryList] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [newGalleryPhoto, setNewGalleryPhoto] = useState({ src: '', title: '', category: 'sports' });

  // Check auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data when session changes or activeTab changes
  useEffect(() => {
    if (!session) return;
    refreshData();
  }, [session, activeTab]);

  const refreshData = async () => {
    if (activeTab === 'media') {
      setLoadingImages(true);
      const imgs = await listUploadedImages();
      setImages(imgs);
      setLoadingImages(false);
    } else if (activeTab === 'news') {
      setLoadingNews(true);
      const items = await getNews();
      setNewsList(items);
      setLoadingNews(false);
    } else if (activeTab === 'events') {
      setLoadingEvents(true);
      const evts = await getEvents();
      setEventsList(evts);
      setLoadingEvents(false);
    } else if (activeTab === 'gallery') {
      setLoadingGallery(true);
      const gal = await getGallery();
      setGalleryList(gal);
      setLoadingGallery(false);
    }
  };

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSubmittingAuth(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });
      if (error) throw error;
      setSession(data.session);
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password');
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Image Upload Handler
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setUploadError('');

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image.`);
        }
        await uploadImage(file);
      }
      const imgs = await listUploadedImages();
      setImages(imgs);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image(s)');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (fileName) => {
    if (!window.confirm(`Delete ${fileName}?`)) return;
    try {
      await deleteUploadedImage(fileName);
      setImages(images.filter((img) => img.name !== fileName));
    } catch (err) {
      alert(`Error deleting image: ${err.message}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(''), 2500);
  };

  // News Handlers
  const handleSaveNews = async (e) => {
    e.preventDefault();
    const form = e.target;
    const itemData = {
      ...editingNews,
      title: form.title.value,
      category: form.category.value,
      categoryLabel: form.category.options[form.category.selectedIndex].text,
      date: form.date.value,
      readTime: form.readTime.value || '3 min',
      excerpt: form.excerpt.value,
      author: form.author.value || 'Admin Office',
      image: form.image.value,
      content: form.content.value,
    };

    await saveNews(itemData);
    setShowNewsModal(false);
    setEditingNews(null);
    const updated = await getNews();
    setNewsList(updated);
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Delete this news article?')) return;
    await deleteNews(id);
    setNewsList(newsList.filter((n) => n.id !== id));
  };

  // Event Handlers
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    await saveEvent(newEvent);
    setNewEvent({ date: '', title: '', time: 'All Day' });
    const evts = await getEvents();
    setEventsList(evts);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await deleteEvent(id);
    setEventsList(eventsList.filter((e) => e.id !== id));
  };

  // Gallery Handlers
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    if (!newGalleryPhoto.src || !newGalleryPhoto.title) return;
    await saveGalleryItem(newGalleryPhoto);
    setNewGalleryPhoto({ src: '', title: '', category: 'sports' });
    const gal = await getGallery();
    setGalleryList(gal);
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Remove photo from gallery?')) return;
    await deleteGalleryItem(id);
    setGalleryList(galleryList.filter((g) => g.id !== id));
  };



  if (loadingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: 'white' }}>
        <RefreshCw className="animate-spin" size={32} />
        <span style={{ marginLeft: '1rem', fontSize: '1.1rem' }}>Connecting to Supabase...</span>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!session) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#1e293b',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          padding: '2.5rem',
          border: '1px solid #334155'
        }}>
          {/* Logo / Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#C41E3A',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 10px 25px rgba(196, 30, 58, 0.4)'
            }}>
              <Lock size={28} color="white" />
            </div>
            <h1 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>CIST Admin Portal</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Canadian International School Tangier
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#4ade80',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              marginTop: '0.5rem'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80' }}></span>
              Supabase Connected
            </div>
          </div>



          {authError && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}



          <form onSubmit={handleAuthSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@cist.ma"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    borderRadius: '10px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    borderRadius: '10px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingAuth}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#C41E3A',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: submittingAuth ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(196, 30, 58, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {submittingAuth ? <RefreshCw className="animate-spin" size={18} /> : null}
              {authMode === 'login' ? 'Sign In to Dashboard' : 'Register Admin Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a
              href="/"
              style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} /> Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED ADMIN PANEL DASHBOARD ---
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}>
        {/* Brand */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#C41E3A',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              C
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>CIST PANEL</h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Supabase CMS</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <button
            onClick={() => setActiveTab('media')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'media' ? '#C41E3A' : 'transparent',
              color: activeTab === 'media' ? 'white' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Upload size={18} />
            Post Pictures (Media)
          </button>

          <button
            onClick={() => setActiveTab('news')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'news' ? '#C41E3A' : 'transparent',
              color: activeTab === 'news' ? 'white' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <FileText size={18} />
            News & Articles
          </button>

          <button
            onClick={() => setActiveTab('events')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'events' ? '#C41E3A' : 'transparent',
              color: activeTab === 'events' ? 'white' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <Calendar size={18} />
            Upcoming Events
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'gallery' ? '#C41E3A' : 'transparent',
              color: activeTab === 'gallery' ? 'white' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <ImageIcon size={18} />
            Campus Gallery
          </button>


        </nav>

        {/* Footer Sidebar info */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
            Logged in as:
            <div style={{ color: '#cbd5e1', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {session?.user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#1e293b',
              color: '#ef4444',
              border: '1px solid #334155',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        {/* Top bar */}
        <header style={{
          backgroundColor: 'white',
          padding: '1rem 2.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {activeTab === 'media' && 'Media Library & Picture Upload'}
              {activeTab === 'news' && 'Manage School News & Articles'}
              {activeTab === 'events' && 'Manage Upcoming Events Calendar'}
              {activeTab === 'gallery' && 'Campus Life Photo Gallery'}
              {activeTab === 'sql' && 'Supabase Cloud Database Status & Setup'}
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Connected to Supabase bucket: <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#C41E3A' }}>{STORAGE_BUCKET}</code>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Eye size={16} /> View Live Site
            </a>
          </div>
        </header>

        {/* Tab Content Container */}
        <div style={{ padding: '2rem 2.5rem', flex: 1 }}>

          {/* TAB 1: MEDIA & PICTURES ("POST PICTURES") */}
          {activeTab === 'media' && (
            <div>
              {/* Uploader Card */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                border: '2px dashed #cbd5e1',
                textAlign: 'center',
                marginBottom: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#C41E3A'
                }}>
                  <Upload size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Upload Pictures to Website</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                  Upload photos directly to your Supabase cloud storage. High-resolution images (WebP, JPG, PNG) will be immediately available.
                </p>

                <input
                  type="file"
                  id="media-file-input"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                <label
                  htmlFor="media-file-input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: '#C41E3A',
                    color: 'white',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(196, 30, 58, 0.35)'
                  }}
                >
                  {uploading ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                  {uploading ? 'Uploading to Supabase...' : 'Select Pictures to Upload'}
                </label>

                {uploadError && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem' }}>
                    {uploadError}
                  </p>
                )}
              </div>

              {/* Uploaded Images Grid */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Uploaded Pictures ({images.length})
                </h3>
                <button
                  onClick={refreshData}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} className={loadingImages ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              {loadingImages ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  <RefreshCw className="animate-spin" size={24} />
                  <p style={{ marginTop: '0.5rem' }}>Loading images from Supabase...</p>
                </div>
              ) : images.length === 0 ? (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                  border: '1px solid #e2e8f0'
                }}>
                  <ImageIcon size={48} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                  <p>No pictures uploaded yet. Use the upload box above to post your first photo!</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {images.map((img) => (
                    <div
                      key={img.name}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ height: '170px', position: 'relative', backgroundColor: '#f1f5f9' }}>
                        <img
                          src={img.publicUrl}
                          alt={img.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>

                      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            margin: '0 0 4px',
                            color: '#0f172a',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }} title={img.name}>
                            {img.name}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {(img.size / 1024).toFixed(1)} KB
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                          <button
                            onClick={() => copyToClipboard(img.publicUrl)}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '8px',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              backgroundColor: copiedUrl === img.publicUrl ? '#dcfce7' : '#f8fafc',
                              color: copiedUrl === img.publicUrl ? '#166534' : '#334155',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {copiedUrl === img.publicUrl ? <Check size={14} /> : <Copy size={14} />}
                            {copiedUrl === img.publicUrl ? 'Copied URL!' : 'Copy URL'}
                          </button>

                          <button
                            onClick={() => handleDeleteImage(img.name)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid #fee2e2',
                              backgroundColor: '#fff5f5',
                              color: '#ef4444',
                              cursor: 'pointer'
                            }}
                            title="Delete image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: NEWS & ARTICLES */}
          {activeTab === 'news' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>School News & Announcements</h3>
                <button
                  onClick={() => {
                    setEditingNews({
                      category: 'announcements',
                      categoryLabel: 'Announcement',
                      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                      readTime: '3 min',
                      title: '',
                      excerpt: '',
                      author: 'Admin Office',
                      image: '',
                      content: '',
                    });
                    setShowNewsModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    backgroundColor: '#C41E3A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={18} /> Add New Article
                </button>
              </div>

              {loadingNews ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <RefreshCw className="animate-spin" size={24} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {newsList.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '14px',
                        padding: '1.25rem',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        gap: '1.5rem',
                        alignItems: 'center'
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            backgroundColor: '#fee2e2',
                            color: '#C41E3A',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {item.categoryLabel || item.category}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.date}</span>
                        </div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                          {item.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.excerpt || item.content}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setEditingNews(item);
                            setShowNewsModal(true);
                          }}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <Edit3 size={15} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #fee2e2',
                            backgroundColor: '#fff5f5',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UPCOMING EVENTS */}
          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Form */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>Add Upcoming Event</h3>
                  <form onSubmit={handleSaveEvent}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Date (e.g. May 20)</label>
                      <input
                        type="text"
                        required
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        placeholder="e.g. Jun 19"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Event Title</label>
                      <input
                        type="text"
                        required
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="e.g. Graduation Ceremony"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Time (optional)</label>
                      <input
                        type="text"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        placeholder="e.g. 10:00 AM - 2:00 PM"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#C41E3A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Save Event
                    </button>
                  </form>
                </div>

                {/* Events List */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>Current Events ({eventsList.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {eventsList.map((evt) => (
                      <div
                        key={evt.id}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          padding: '1rem',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 800, color: '#C41E3A', fontSize: '1rem', marginRight: '12px' }}>{evt.date}</span>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{evt.title}</span>
                          <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: '12px' }}>({evt.time})</span>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #fee2e2',
                            backgroundColor: '#fff5f5',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAMPUS GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              {/* Add photo to gallery card */}
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>Add Photo to Campus Gallery</h3>
                <form onSubmit={handleSaveGallery} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Image URL</label>
                    <input
                      type="text"
                      required
                      value={newGalleryPhoto.src}
                      onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, src: e.target.value })}
                      placeholder="Paste Supabase image URL here..."
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Photo Title</label>
                    <input
                      type="text"
                      required
                      value={newGalleryPhoto.title}
                      onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, title: e.target.value })}
                      placeholder="e.g. Science Fair"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Category</label>
                    <select
                      value={newGalleryPhoto.category}
                      onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, category: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    >
                      <option value="sports">Sports</option>
                      <option value="arts">Arts</option>
                      <option value="academics">Academics</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#C41E3A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Add to Gallery
                  </button>
                </form>
              </div>

              {/* Gallery Photos Grid */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>Photos in Gallery ({galleryList.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {galleryList.map((g) => (
                  <div key={g.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ height: '140px' }}>
                      <img src={g.src} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{g.title}</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>{g.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteGallery(g.id)}
                        style={{ padding: '6px', borderRadius: '6px', border: 'none', backgroundColor: '#fff5f5', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DATABASE SETUP (SQL) */}
          {activeTab === 'sql' && (
            <div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Database size={24} color="#C41E3A" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Supabase Cloud Connection Status</h3>
                  </div>
                  <button
                    onClick={verifyTables}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={14} className={checkingTables ? 'animate-spin' : ''} /> Check Status
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Storage Bucket (`website-images`)</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>Active & Ready</div>
                  </div>
                  <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: tablesStatus.news ? '#f0fdf4' : '#fffbeb', border: tablesStatus.news ? '1px solid #bbf7d0' : '1px solid #fde68a' }}>
                    <div style={{ fontSize: '0.8rem', color: tablesStatus.news ? '#166534' : '#92400e', fontWeight: 600 }}>Table: news_items</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: tablesStatus.news ? '#15803d' : '#b45309', marginTop: '4px' }}>
                      {tablesStatus.news ? 'Created (Supabase)' : 'Local Storage Mode'}
                    </div>
                  </div>
                  <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: tablesStatus.events ? '#f0fdf4' : '#fffbeb', border: tablesStatus.events ? '1px solid #bbf7d0' : '1px solid #fde68a' }}>
                    <div style={{ fontSize: '0.8rem', color: tablesStatus.events ? '#166534' : '#92400e', fontWeight: 600 }}>Table: upcoming_events</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: tablesStatus.events ? '#15803d' : '#b45309', marginTop: '4px' }}>
                      {tablesStatus.events ? 'Created (Supabase)' : 'Local Storage Mode'}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '0.9rem', color: '#1e40af' }}>
                  💡 <strong>Note:</strong> Picture uploading works right now via Supabase Storage! To also sync news & events across all devices in real-time database tables, copy the SQL below and run it in your <a href="https://supabase.com/dashboard/project/mipigglfdxjoormlfxnw/sql" target="_blank" rel="noreferrer" style={{ color: '#C41E3A', fontWeight: 700 }}>Supabase SQL Editor</a>.
                </div>
              </div>

              {/* SQL Code Snippet */}
              <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' }}>
                <div style={{ padding: '1rem 1.5rem', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.9rem' }}>schema.sql (Copy into Supabase SQL Editor)</span>
                  <button
                    onClick={() => copyToClipboard(sqlMigrationCode)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      backgroundColor: copiedUrl === sqlMigrationCode ? '#22c55e' : '#C41E3A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedUrl === sqlMigrationCode ? <Check size={14} /> : <Copy size={14} />}
                    {copiedUrl === sqlMigrationCode ? 'Copied SQL!' : 'Copy SQL'}
                  </button>
                </div>
                <pre style={{
                  padding: '1.5rem',
                  margin: 0,
                  color: '#38bdf8',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  fontFamily: 'Consolas, monospace'
                }}>
                  {sqlMigrationCode}
                </pre>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* EDIT / ADD NEWS MODAL */}
      {showNewsModal && editingNews && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                {editingNews.id ? 'Edit Article' : 'New Article'}
              </h3>
              <button
                onClick={() => { setShowNewsModal(false); setEditingNews(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNews}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingNews.title}
                  placeholder="Article title..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Category</label>
                  <select
                    name="category"
                    defaultValue={editingNews.category}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  >
                    <option value="announcements">Announcement</option>
                    <option value="achievements">Achievement</option>
                    <option value="events">Event</option>
                    <option value="academics">Academics</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Date</label>
                  <input
                    type="text"
                    name="date"
                    required
                    defaultValue={editingNews.date}
                    placeholder="e.g. October 15, 2026"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Author</label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={editingNews.author || 'Admin Office'}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Read Time</label>
                  <input
                    type="text"
                    name="readTime"
                    defaultValue={editingNews.readTime || '3 min'}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Featured Image URL</label>
                <input
                  type="text"
                  name="image"
                  defaultValue={editingNews.image}
                  placeholder="Paste URL from Media tab or local image path..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Short Summary / Excerpt</label>
                <input
                  type="text"
                  name="excerpt"
                  defaultValue={editingNews.excerpt}
                  placeholder="Brief summary..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Full Content</label>
                <textarea
                  name="content"
                  rows={4}
                  defaultValue={editingNews.content}
                  placeholder="Full text of the article..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setShowNewsModal(false); setEditingNews(null); }}
                  style={{ padding: '10px 18px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', backgroundColor: '#C41E3A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
