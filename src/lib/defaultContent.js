// Built-in website content. Used until the admin edits it, and as a fallback if Supabase can't be reached.

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
  // Sports
  { id: 13, src: '/images/sport/match.webp', category: 'sports', title: 'Football Match' },
  { id: 14, src: '/images/sport/plan.webp', category: 'sports', title: 'Team Strategy' },
  { id: 15, src: '/images/sport/plan1.webp', category: 'sports', title: 'Game Plan' },
  { id: 16, src: '/images/sport/team%20C.webp', category: 'sports', title: 'Team C' },
  { id: 1, src: '/images/sport/sport1.webp', category: 'sports', title: 'Football Tournament' },
  { id: 2, src: '/images/sport/sport2.webp', category: 'sports', title: 'Football Match' },
  { id: 3, src: '/images/sport/sport3.webp', category: 'sports', title: 'Football Championship' },
  { id: 4, src: '/images/sport/sport4.webp', category: 'sports', title: 'Football Game' },
  { id: 5, src: '/images/sport/sport5.webp', category: 'sports', title: 'Football Finals' },
  { id: 6, src: '/images/sport/sport6.webp', category: 'sports', title: 'Football Competition' },
  { id: 7, src: '/images/sport/sport7.webp', category: 'sports', title: 'Football Training' },
  { id: 8, src: '/images/sport/sport8.webp', category: 'sports', title: 'Football Practice' },
  { id: 9, src: '/images/sport/sport9.webp', category: 'sports', title: 'Football Championship' },
  { id: 10, src: '/images/sport/sport10.webp', category: 'sports', title: 'Football Tournament' },
  { id: 11, src: '/images/sport/sport11.webp', category: 'sports', title: 'Football Match' },
  { id: 12, src: '/images/sport/sport12.webp', category: 'sports', title: 'Inter School Football' },
  // Community service
  { id: 101, src: '/images/community/easter1.webp', category: 'community', title: 'Easter Celebration' },
  { id: 102, src: '/images/community/students.webp', category: 'community', title: 'Community' },
  { id: 103, src: '/images/community/graduation4.jpg', category: 'community', title: 'Community' },
  { id: 104, src: '/images/community/kids1.webp', category: 'community', title: 'Kids Activities' },
  { id: 202, src: '/images/community/community.webp', category: 'community', title: 'Special Needs Workshop' },
  { id: 203, src: '/images/community/community%20(2).webp', category: 'community', title: 'Special Needs Workshop' },
  { id: 204, src: '/images/community/community%20(3).webp', category: 'community', title: 'Special Needs Workshop' },
  { id: 205, src: '/images/community/community%20(4).webp', category: 'community', title: 'Special Needs Workshop' },
  { id: 206, src: '/images/community/community%20(5).webp', category: 'community', title: 'Special Needs Workshop' },
  { id: 207, src: '/images/community/community%20(6).webp', category: 'community', title: 'Special Needs Workshop' },
  // Academics
  { id: 301, src: '/images/academy/graduation1.webp', category: 'academics', title: 'Graduation Celebration' },
  { id: 302, src: '/images/academy/graduation2.webp', category: 'academics', title: 'Graduation Ceremony' },
  { id: 303, src: '/images/academy/graduation3.webp', category: 'academics', title: 'Class of 2024' },
  { id: 304, src: '/images/academy/graduation0.webp', category: 'academics', title: 'Graduation Day' },
  { id: 305, src: '/images/academy/art-4.webp', category: 'academics', title: 'Classroom' },
  // Arts
  { id: 401, src: '/images/art/art-1.webp', category: 'arts', title: 'Art Exhibition' },
  { id: 402, src: '/images/art/art-2.webp', category: 'arts', title: 'Visual Arts' },
  { id: 405, src: '/images/art/art-5.webp', category: 'arts', title: 'Art Gallery' },
];

/** Pictures used in fixed places on the landing page. Editable in Admin → Page images. */
export const DEFAULT_IMAGES = {
  logo: '/images/logo.webp',
  heroSlides: ['/images/hero1.webp', '/images/hero2.webp'],
  aboutMain: '/images/about%20us.webp',
  aboutInset: '/images/academy/art-4.webp',
  programKindergarten: '/images/Academics/kindergarten_new.jpg',
  programPrimary: '/images/Academics/primary_new.jpg',
  programMiddle: '/images/Academics/middle_new.jpg',
  programHigh: '/images/Academics/high_new.jpg',
};

/** School contact details and links. Editable in Admin → School info. */
export const DEFAULT_SETTINGS = {
  phone: '+212 80 857 0841',
  whatsapp: '+212 80 857 0841',
  email: 'contact@cist.ma',
  addressLine1: 'Route du Charf, Km 5',
  addressLine2: 'Tangier 90000, Morocco',
  mapDirectionsUrl: 'https://maps.app.goo.gl/CfRE2FrXNx3VUhiH6',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.5!2d-5.9036!3d35.7267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b89b5f5a5a5a5%3A0x5a5a5a5a5a5a5a5a!2sCanadian%20International%20School%20Tangier!5e0!3m2!1sen!2sma!4v1609459200000!5m2!1sen!2sma',
  facebookUrl: 'https://www.facebook.com/cis.ac.ma/',
  instagramUrl: 'https://www.instagram.com/cis_tangier/',
  linkedinUrl: 'https://ma.linkedin.com/company/canadian-international-school-of-tangier',
};
