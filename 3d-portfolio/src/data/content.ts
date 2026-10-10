// ─────────────────────────────────────────────────────────────────────────────
// src/data/content.ts
// ALL editable content lives here. The client can update this file without
// touching any component code.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: 'BUILDsy',
  tagline: 'Tiles & Sanitaryware Store',
  city: 'Dehradun',
  website: 'https://buildsy.in/',
  phone: '+91-XXXXXXXXXX',     // TODO: replace with real number
  whatsapp: '+91-XXXXXXXXXX',  // TODO: replace with real WhatsApp
  email: 'hello@buildsy.in',   // TODO: replace
  address: 'TODO: Full showroom address, Dehradun, Uttarakhand',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Dehradun&output=embed', // TODO: real embed URL
  openingHours: 'Mon – Sat: 10 AM – 7 PM  |  Sun: 11 AM – 5 PM',
  social: {
    instagram: 'https://instagram.com/', // TODO
    facebook: 'https://facebook.com/',   // TODO
  },
}

// ── Navigation doors ─────────────────────────────────────────────────────────
export const DOORS = [
  { id: 'tiles',       label: 'Floor & Wall Tiles',   icon: '🟫', color: '#c8a882' },
  { id: 'sanitaryware',label: 'Sanitaryware',          icon: '🚿', color: '#7ec8e3' },
  { id: 'visualizer',  label: 'Room Visualizer',       icon: '🏠', color: '#a8d8b9' },
  { id: 'collections', label: 'Collections & Brands',  icon: '✦',  color: '#e6b9a6' },
  { id: 'visit',       label: 'Visit Our Showroom',    icon: '📍', color: '#f5c77e' },
  { id: 'about',       label: 'About & Policies',      icon: '📄', color: '#c3b1d1' },
  { id: 'contact',     label: 'Get a Quote',           icon: '💬', color: '#99c6a8' },
]

// ── Tile categories ───────────────────────────────────────────────────────────
export const TILE_CATEGORIES = [
  { id: 'floor', label: 'Floor Tiles' },
  { id: 'wall',  label: 'Wall Tiles'  },
  { id: 'outdoor', label: 'Outdoor / Exterior' },
  { id: 'wooden', label: 'Wooden Look' },
  { id: 'marble', label: 'Marble Look' },
]

export const TILE_FINISHES = ['Matt', 'Glossy', 'Satin', 'Textured', 'Anti-Skid']

export const TILE_SIZES = ['30×30 cm', '60×60 cm', '60×120 cm', '80×80 cm', '120×180 cm']

// TODO: replace with real product data from client
export const TILES: Product[] = [
  { id: 't1', name: 'Carrara White', category: 'wall', finish: 'Glossy', size: '60×120 cm', color: '#f5f5f0', image: null, price: null, sku: 'TODO-T001' },
  { id: 't2', name: 'Rustic Oak',    category: 'floor', finish: 'Matt',   size: '20×120 cm', color: '#b8936a', image: null, price: null, sku: 'TODO-T002' },
  { id: 't3', name: 'Nero Marquina', category: 'floor', finish: 'Glossy', size: '60×60 cm',  color: '#1a1a1a', image: null, price: null, sku: 'TODO-T003' },
  { id: 't4', name: 'Beige Stone',   category: 'outdoor', finish: 'Anti-Skid', size: '40×40 cm', color: '#d4b896', image: null, price: null, sku: 'TODO-T004' },
  { id: 't5', name: 'Forest Green',  category: 'wall', finish: 'Satin',  size: '30×60 cm',  color: '#4a7c59', image: null, price: null, sku: 'TODO-T005' },
  { id: 't6', name: 'Arctic Gloss',  category: 'wall', finish: 'Glossy', size: '30×60 cm',  color: '#e8f4f8', image: null, price: null, sku: 'TODO-T006' },
]

// ── Sanitaryware ──────────────────────────────────────────────────────────────
export const SANITARY_CATEGORIES = [
  { id: 'basin',    label: 'Basins & Sinks' },
  { id: 'wc',       label: 'WC / Toilets'   },
  { id: 'faucet',   label: 'Faucets & Taps' },
  { id: 'shower',   label: 'Showers'        },
  { id: 'accessory',label: 'Accessories'    },
]

// TODO: replace with real product data
export const SANITARY_PRODUCTS: Product[] = [
  { id: 's1', name: 'Wall-Hung Basin',   category: 'basin',  finish: 'White', size: '50 cm',   color: '#f0f0ec', image: null, price: null, sku: 'TODO-S001' },
  { id: 's2', name: 'Close-Coupled WC', category: 'wc',    finish: 'White', size: 'Standard', color: '#f0f0ec', image: null, price: null, sku: 'TODO-S002' },
  { id: 's3', name: 'Rain Shower Head', category: 'shower', finish: 'Chrome', size: '30 cm',  color: '#c8d0d4', image: null, price: null, sku: 'TODO-S003' },
  { id: 's4', name: 'Single Lever Mixer', category: 'faucet', finish: 'Chrome', size: 'Standard', color: '#b8c4c8', image: null, price: null, sku: 'TODO-S004' },
]

// ── Brands ────────────────────────────────────────────────────────────────────
// TODO: replace with real brand logos / data
export const BRANDS = [
  { id: 'b1', name: 'TODO Brand 1', description: 'Premium Italian tiles' },
  { id: 'b2', name: 'TODO Brand 2', description: 'German sanitaryware' },
  { id: 'b3', name: 'TODO Brand 3', description: 'Indian handmade ceramics' },
]

// ── Room types for visualizer ─────────────────────────────────────────────────
export const ROOM_TYPES = [
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'kitchen',  label: 'Kitchen'  },
  { id: 'living',   label: 'Living Room' },
  { id: 'bedroom',  label: 'Bedroom'  },
  { id: 'outdoor',  label: 'Outdoor'  },
]

// ── FAQs ──────────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    q: 'Do you deliver tiles to my home in Dehradun?',
    a: 'Yes, we offer delivery across Dehradun and nearby areas. Delivery charges may apply based on distance and order size. Contact us for details.',
  },
  {
    q: 'Can I return tiles if the colour looks different at home?',
    a: 'We accept returns of unused, undamaged tiles in original packaging within 7 days of purchase. Please check our full return policy for terms.',
  },
  {
    q: 'Do you provide installation services?',
    a: 'We can recommend trusted tile-laying contractors in Dehradun, but we do not directly offer installation. Contact us for referrals.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept cash, UPI, credit/debit cards, and bank transfer. Online orders support card and UPI payments (Razorpay integration – TODO).',
  },
  {
    q: 'Do you have sample tiles I can take home?',
    a: 'Yes! Visit our showroom and take up to 3 sample tiles home to check in your space. Sample deposit is refundable.',
  },
]

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  category: string
  finish: string
  size: string
  color: string
  image: string | null   // null = use color swatch until real images are ready
  price: string | null   // null = "Contact for price"
  sku: string
}

export interface CartItem {
  product: Product
  qty: number
}
