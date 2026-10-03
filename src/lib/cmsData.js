import { supabase, supabaseUrl } from './supabase';

export const DEFAULT_NEWS = [
  {
    id: 1,
    category: 'announcements',
    categoryLabel: 'Announcement',
    date: 'June 1, 2026',
    readTime: '4 min',
    title: 'Holidays 2027 - Canadian International School Tangier',
    excerpt: 'View all school holidays, breaks, and important dates for the 2027 academic year at CIST.',
    author: 'Admin Office',
    image: '/images/events/Holidays.webp',
    content: 'The holidays calendar for 2027 is now available for Canadian International School Tangier. Plan your family vacations and important events around school holidays, breaks, and professional development days.',
  },
  {
    id: 2,
    category: 'achievements',
    categoryLabel: 'Achievement',
    date: 'April 15, 2024',
    readTime: '3 min',
    title: 'Student Wins National Robotics Competition',
    excerpt: 'One of our talented students brought home the trophy from the National Robotics Championship.',
    author: 'Dr. Sarah Ahmed',
    image: '/images/events/achievment1.webp',
    content: 'We are thrilled to announce that one of our outstanding students has won the National Robotics Competition! This remarkable achievement showcases the excellence of our STEM and robotics program. The student demonstrated exceptional programming skills, engineering creativity, and problem-solving abilities. Congratulations to our champion!',
  },
  {
    id: 3,
    category: 'achievements',
    categoryLabel: 'Achievement',
    date: 'March 20, 2024',
    readTime: '3 min',
    title: 'CIST Students Win Ramadan Mini Football Tournament',
    excerpt: 'Our students beat competing schools and brought home the championship trophy from the Ramadan Mini Football Tournament.',
    author: 'Coach Yassir',
    image: '/images/events/sport10.webp',
    content: 'Congratulations to our amazing students for winning the Ramadan Mini Football Tournament! CIST faced off against several other schools in a thrilling competition, and our team rose to the challenge with exceptional skill, teamwork, and sportsmanship. Competing against strong opponents, they delivered outstanding performances in every match. This victory is a testament to their dedication and hard work in training. We are incredibly proud of their achievement!',
  },
  {
    id: 4,
    category: 'events',
    categoryLabel: 'Event',
    date: 'May 21, 2026',
    readTime: '3 min',
    title: 'CIST × Baraat Al Boughaz — Recreational Day at Medina Forest',
    excerpt: 'CIST partnered with Baraat Al Boughaz Association to organise a fun-filled outdoor day for our students at Medina Forest.',
    author: 'Admin Office',
    image: '/images/events/collab.webp',
    content: 'On Thursday, May 21, 2026, CIST students enjoyed a special recreational day at Medina Forest in collaboration with the Baraat Al Boughaz Association. The programme was packed with activities designed to nurture teamwork, creativity, and joy — including flag salute, sports competitions, group games, a shared breakfast, artistic creations, a drawing competition, and an educational nature lab. It was a wonderful day that brought our school community closer together while connecting students with the beautiful natural environment of Tangier.',
  },
];

export const DEFAULT_EVENTS = [
  { id: 1, date: 'May 20', title: 'School Trip', time: 'All Day' },
  { id: 2, date: 'Jun 19', title: 'Graduation Ceremony', time: '10:00 AM - 2:00 PM' },
];

export const DEFAULT_GALLERY = [
  { id: 13, src: '/images/sport/match.webp', category: 'sports', title: 'Football Match' },
  { id: 14, src: '/images/sport/plan.webp', category: 'sports', title: 'Team Strategy' },
  { id: 15, src: '/images/sport/plan1.webp', category: 'sports', title: 'Game Plan' },
  { id: 16, src: '/images/sport/team%20C.webp', category: 'sports', title: 'Team C' },
  { id: 1, src: '/images/sport/sport1.webp', category: 'sports', title: 'Football Tournament' },
  { id: 2, src: '/images/sport/sport2.webp', category: 'sports', title: 'Football Match' },
  { id: 3, src: '/images/sport/sport3.webp', category: 'sports', title: 'Football Championship' },
  { id: 101, src: '/images/community/easter1.webp', category: 'community', title: 'Easter Celebration' },
  { id: 102, src: '/images/community/students.webp', category: 'community', title: 'Community Service' },
];

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
export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from('upcoming_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Supabase upcoming_events table not reachable', e);
  }

  const local = localStorage.getItem('cist_custom_events');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return DEFAULT_EVENTS;
    }
  }
  return DEFAULT_EVENTS;
}

export async function saveEvent(eventItem) {
  try {
    if (eventItem.id && typeof eventItem.id === 'string' && isNaN(Number(eventItem.id))) {
      await supabase.from('upcoming_events').update(eventItem).eq('id', eventItem.id);
    } else {
      const itemToInsert = { ...eventItem };
      if (typeof itemToInsert.id === 'number') delete itemToInsert.id;
      await supabase.from('upcoming_events').insert([itemToInsert]);
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
  return true;
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
  try {
    const itemToInsert = { ...galleryItem };
    if (typeof itemToInsert.id === 'number') delete itemToInsert.id;
    await supabase.from('gallery_photos').insert([itemToInsert]);
  } catch (e) {
    console.warn('Could not save to Supabase gallery_photos', e);
  }

  const current = await getGallery();
  const updated = [{ ...galleryItem, id: galleryItem.id || Date.now() }, ...current];
  localStorage.setItem('cist_custom_gallery', JSON.stringify(updated));
  window.dispatchEvent(new Event('cist_content_updated'));
  return true;
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
export const STORAGE_BUCKET = 'website-images';

export async function uploadImage(file) {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${Date.now()}_${sanitizedName}`;

  const { data, error } = await supabase.storage
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

// Check database table availability
export async function checkTablesAvailability() {
  try {
    const { error: newsErr } = await supabase.from('news_items').select('id').limit(1);
    const { error: eventsErr } = await supabase.from('upcoming_events').select('id').limit(1);
    const { error: galleryErr } = await supabase.from('gallery_photos').select('id').limit(1);

    return {
      news: !newsErr,
      events: !eventsErr,
      gallery: !galleryErr,
      allReady: !newsErr && !eventsErr && !galleryErr,
    };
  } catch {
    return { news: false, events: false, gallery: false, allReady: false };
  }
}
