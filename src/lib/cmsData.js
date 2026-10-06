import { supabase, supabaseUrl } from './supabase';
import { DEFAULT_NEWS, DEFAULT_EVENTS, DEFAULT_GALLERY } from './defaultContent';

export { DEFAULT_NEWS, DEFAULT_EVENTS };

// --- NEWS API ---
export async function getNews() {
  try {
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Supabase news_items table not reachable, checking localStorage', e);
  }

  // Fallback to localStorage or default
  const local = localStorage.getItem('cist_custom_news');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return DEFAULT_NEWS;
    }
  }
  return DEFAULT_NEWS;
}

export async function saveNews(newsItem) {
  let isSavedInSupabase = false;
  try {
    if (newsItem.id && typeof newsItem.id === 'string' && isNaN(Number(newsItem.id))) {
      const { error } = await supabase
        .from('news_items')
        .update(newsItem)
        .eq('id', newsItem.id);
      if (!error) isSavedInSupabase = true;
    } else {
      const itemToInsert = { ...newsItem };
      if (typeof itemToInsert.id === 'number') delete itemToInsert.id;
      const { error } = await supabase
        .from('news_items')
        .insert([itemToInsert]);
      if (!error) isSavedInSupabase = true;
    }
  } catch (e) {
    console.warn('Could not save to Supabase news_items', e);
  }

  // Always mirror in localStorage for immediate local view
  const current = await getNews();
  let updated;
  if (newsItem.id) {
    const exists = current.some((n) => n.id === newsItem.id);
    if (exists) {
      updated = current.map((n) => (n.id === newsItem.id ? { ...n, ...newsItem } : n));
    } else {
      updated = [newsItem, ...current];
    }
  } else {
    updated = [{ ...newsItem, id: Date.now() }, ...current];
  }
  localStorage.setItem('cist_custom_news', JSON.stringify(updated));
  window.dispatchEvent(new Event('cist_content_updated'));
  return { success: true, savedInSupabase: isSavedInSupabase };
}

export async function deleteNews(id) {
  try {
    await supabase.from('news_items').delete().eq('id', id);
  } catch (e) {
    console.warn('Could not delete from Supabase news_items', e);
  }

  const current = await getNews();
  const updated = current.filter((n) => n.id !== id);
  localStorage.setItem('cist_custom_news', JSON.stringify(updated));
  window.dispatchEvent(new Event('cist_content_updated'));
  return true;
}

// --- UPCOMING EVENTS API ---
// The pinned event (chosen in Admin → Events) always comes first; the rest keep their order
const pinnedFirst = (events) => [...events].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from('upcoming_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return pinnedFirst(data);
    }
  } catch (e) {
    console.warn('Supabase upcoming_events table not reachable', e);
  }

  const local = localStorage.getItem('cist_custom_events');
  if (local) {
    try {
      return pinnedFirst(JSON.parse(local));
    } catch {
      return DEFAULT_EVENTS;
    }
  }
  return DEFAULT_EVENTS;
}

export async function saveEvent(eventItem) {
  let isSavedInSupabase = false;
  try {
    if (eventItem.id && typeof eventItem.id === 'string' && isNaN(Number(eventItem.id))) {
      const { error } = await supabase.from('upcoming_events').update(eventItem).eq('id', eventItem.id);
      if (!error) isSavedInSupabase = true;
    } else {
      const itemToInsert = { ...eventItem };
      if (typeof itemToInsert.id === 'number') delete itemToInsert.id;
      const { error } = await supabase.from('upcoming_events').insert([itemToInsert]);
      if (!error) isSavedInSupabase = true;
    }
  } catch (e) {
    console.warn('Could not save to Supabase upcoming_events', e);
  }

  const current = await getEvents();
  let updated;
  if (eventItem.id) {
    const exists = current.some((e) => e.id === eventItem.id);
    if (exists) {
      updated = current.map((e) => (e.id === eventItem.id ? { ...e, ...eventItem } : e));
    } else {
      updated = [eventItem, ...current];
    }
  } else {
    updated = [{ ...eventItem, id: Date.now() }, ...current];
  }
  localStorage.setItem('cist_custom_events', JSON.stringify(updated));
  window.dispatchEvent(new Event('cist_content_updated'));
  return { success: true, savedInSupabase: isSavedInSupabase };
}

export async function deleteEvent(id) {
  try {
    await supabase.from('upcoming_events').delete().eq('id', id);
  } catch (e) {
    console.warn('Could not delete from Supabase upcoming_events', e);
  }

  const current = await getEvents();
  const updated = current.filter((e) => e.id !== id);
  localStorage.setItem('cist_custom_events', JSON.stringify(updated));
  window.dispatchEvent(new Event('cist_content_updated'));
  return true;
}

// --- GALLERY API ---
export async function getGallery() {
  try {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Supabase gallery_photos table not reachable', e);
  }

  const local = localStorage.getItem('cist_custom_gallery');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return DEFAULT_GALLERY;
    }
  }
  return DEFAULT_GALLERY;
}

export async function saveGalleryItem(galleryItem) {
  let isSavedInSupabase = false;
  try {
    if (galleryItem.id && typeof galleryItem.id === 'string' && isNaN(Number(galleryItem.id))) {
      const { error } = await supabase.from('gallery_photos').update(galleryItem).eq('id', galleryItem.id);
      if (!error) isSavedInSupabase = true;
    } else {
      const itemToInsert = { ...galleryItem };
      if (typeof itemToInsert.id === 'number') delete itemToInsert.id;
      const { error } = await supabase.from('gallery_photos').insert([itemToInsert]);
      if (!error) isSavedInSupabase = true;
    }
  } catch (e) {
    console.warn('Could not save to Supabase gallery_photos', e);
  }

  const current = await getGallery();
  let updated;
  if (galleryItem.id && current.some((g) => g.id === galleryItem.id)) {
    updated = current.map((g) => (g.id === galleryItem.id ? { ...g, ...galleryItem } : g));
  } else {
    updated = [{ ...galleryItem, id: galleryItem.id || Date.now() }, ...current];
  }
  localStorage.setItem('cist_custom_gallery', JSON.stringify(updated));
  window.dispatchEvent(new Event('cist_content_updated'));
  return { success: true, savedInSupabase: isSavedInSupabase };
}

export async function deleteGalleryItem(id) {
  try {
    await supabase.from('gallery_photos').delete().eq('id', id);
  } catch (e) {
    console.warn('Could not delete from Supabase gallery_photos', e);
  }

  const current = await getGallery();
  const updated = current.filter((g) => g.id !== id);
  localStorage.setItem('cist_custom_gallery', JSON.stringify(updated));
  window.dispatchEvent(new Event('cist_content_updated'));
  return true;
}

// --- SUPABASE STORAGE (PHOTOS / IMAGES) ---
const STORAGE_BUCKET = 'website-images';

export async function uploadImage(file) {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${Date.now()}_${sanitizedName}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;
  return {
    fileName,
    publicUrl,
    size: file.size,
    created_at: new Date().toISOString(),
  };
}

export async function listUploadedImages() {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('Failed to list images:', error);
    return [];
  }

  return (data || [])
    .filter((item) => item.name && !item.name.startsWith('.'))
    .map((item) => ({
      name: item.name,
      id: item.id,
      size: item.metadata?.size || 0,
      created_at: item.created_at,
      publicUrl: `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${item.name}`,
    }));
}

export async function deleteUploadedImage(fileName) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([fileName]);

  if (error) {
    throw new Error(error.message);
  }
  return true;
}

// --- SITE CONTENT (page images, school info, text overrides) ---
// One row per key in the `site_content` table: 'images', 'settings', 'translations'.
const SITE_CACHE = 'cist_site_content';

const readSiteCache = () => {
  try {
    return JSON.parse(localStorage.getItem(SITE_CACHE)) || {};
  } catch {
    return {};
  }
};

export async function getSiteContent() {
  try {
    const { data, error } = await supabase.from('site_content').select('key, value');
    if (!error && data) {
      const content = Object.fromEntries(data.map((row) => [row.key, row.value]));
      localStorage.setItem(SITE_CACHE, JSON.stringify(content));
      return content;
    }
  } catch (e) {
    console.warn('Supabase site_content table not reachable, using cached content', e);
  }
  return readSiteCache();
}

/** Cached copy for the first paint, before Supabase answers. */
export const getCachedSiteContent = readSiteCache;

export async function saveSiteContent(key, value) {
  let isSavedInSupabase = false;
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (!error) isSavedInSupabase = true;
  } catch (e) {
    console.warn('Could not save to Supabase site_content', e);
  }

  localStorage.setItem(SITE_CACHE, JSON.stringify({ ...readSiteCache(), [key]: value }));
  window.dispatchEvent(new Event('cist_content_updated'));
  return { success: true, savedInSupabase: isSavedInSupabase };
}
