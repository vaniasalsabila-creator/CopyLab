import type { Folder, Option, Project, Variation } from '../types'

const t = Date.UTC(2026, 8, 1, 4, 0, 0)
const t2 = Date.UTC(2026, 7, 28, 8, 0, 0)

export const SAMPLE_FOLDERS: Folder[] = [
  { id: 'folder-insurance', name: 'Insurance', createdAt: t2 },
  { id: 'folder-travel', name: 'Travel', createdAt: t2 },
  { id: 'folder-payment', name: 'Payment', createdAt: t2 },
  { id: 'folder-promotions', name: 'Promotions', createdAt: t2 },
]

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'project-segment-11',
    name: 'Insurance AB Testing — Segment 1.1',
    description: 'Uninsured Non-Buyers / First Timers',
    folderId: 'folder-insurance',
    createdAt: t2,
    updatedAt: t,
  },
  {
    id: 'project-flight-retarget',
    name: 'Flight Insurance — Retargeting',
    description: 'Users who viewed FDS but did not add it',
    folderId: 'folder-insurance',
    createdAt: t2,
    updatedAt: t2,
  },
]

export const SAMPLE_VARIATIONS: Variation[] = [
  { id: 'var-control', projectId: 'project-segment-11', name: 'Control', description: 'Current production message.', createdAt: t },
  { id: 'var-benefit', projectId: 'project-segment-11', name: 'Benefit Highlight', description: 'Focus on FDS benefits.', createdAt: t },
  { id: 'var-social', projectId: 'project-segment-11', name: 'Social Proof', description: 'Lead with other travelers’ choices.', createdAt: t },
  { id: 'var-combo', projectId: 'project-segment-11', name: 'Benefit + Social Proof', description: 'Combine protection benefits with social proof.', createdAt: t },
]

export const SAMPLE_OPTIONS: Option[] = [
  {
    id: 'opt-control-1',
    variationId: 'var-control',
    name: 'Option 1 — Current',
    createdAt: t,
    copy: {
      whatsapp: {
        en: 'Hi! Add extra protection to your flight booking with Flight Delay Service from tiket.com. Stay covered if your flight is delayed or cancelled.',
        id: 'Hai! Tambahkan perlindungan ekstra pada pemesanan pesawatmu dengan Flight Delay Service dari tiket.com. Tetap terlindungi jika penerbanganmu tertunda atau dibatalkan.',
      },
      push: {
        title: { en: 'Add flight protection', id: 'Tambah perlindungan pesawat' },
        subtitle: { en: 'Stay covered if your flight is delayed.', id: 'Tetap terlindungi jika penerbangan tertunda.' },
      },
      sms: {
        en: 'tiket.com: Add Flight Delay Service to your booking and stay covered if your flight is delayed or cancelled.',
        id: 'tiket.com: Tambahkan Flight Delay Service pada pemesananmu, tetap terlindungi jika penerbangan tertunda/dibatalkan.',
      },
    },
  },
  {
    id: 'opt-bh-1',
    variationId: 'var-benefit',
    name: 'Option 1 — Recommended',
    createdAt: t,
    copy: {
      whatsapp: {
        en: 'Unexpected delays can happen to anyone. With Flight Delay Service from tiket.com, you get compensation when your flight is disrupted — so your trip stays on track, even when the unexpected happens.',
        id: 'Keterlambatan bisa terjadi pada siapa saja. Dengan Flight Delay Service dari tiket.com, kamu mendapat kompensasi saat penerbanganmu terganggu — perjalanan tetap tenang, meski terjadi hal tak terduga.',
      },
      push: {
        title: { en: 'Protect your trip ✈️', id: 'Lindungi perjalananmu ✈️' },
        subtitle: { en: 'Flight disruptions can happen. Stay protected.', id: 'Penerbangan bisa terganggu. Tetap terlindungi.' },
      },
      sms: {
        en: 'tiket.com: Get compensation if your flight is delayed or cancelled. Add Flight Delay Service now and stay protected.',
        id: 'tiket.com: Dapatkan kompensasi jika penerbanganmu tertunda/dibatalkan. Tambahkan Flight Delay Service sekarang.',
      },
    },
  },
  {
    id: 'opt-bh-2',
    variationId: 'var-benefit',
    name: 'Option 2 — UX Writing',
    createdAt: t,
    copy: {
      whatsapp: {
        en: 'Your flight might not go as planned. A little protection now means compensation later if it’s delayed or cancelled. Add Flight Delay Service before you fly.',
        id: 'Penerbanganmu mungkin tidak berjalan sesuai rencana. Perlindungan kecil sekarang berarti kompensasi nanti jika tertunda atau dibatalkan. Tambahkan Flight Delay Service sebelum terbang.',
      },
      push: {
        title: { en: 'A little protection', id: 'Perlindungan kecil, berarti' },
        subtitle: { en: 'Get covered for unexpected flight disruptions.', id: 'Lindungi dirimu dari gangguan penerbangan.' },
      },
      sms: {
        en: 'tiket.com: A little protection now means compensation later. Add Flight Delay Service before you fly.',
        id: 'tiket.com: Sedikit perlindungan sekarang, kompensasi nanti. Tambahkan Flight Delay Service sebelum terbang.',
      },
    },
  },
  {
    id: 'opt-bh-3',
    variationId: 'var-benefit',
    name: 'Option 3 — WIN Framework',
    createdAt: t,
    copy: {
      whatsapp: {
        en: 'Get money back when your flight is delayed. Flight Delay Service pays you compensation so a disruption doesn’t have to ruin your trip — or your budget.',
        id: 'Dapatkan uang kembali saat penerbanganmu tertunda. Flight Delay Service memberikan kompensasi agar gangguan tidak merusak perjalanan — atau anggaranmu.',
      },
      push: {
        title: { en: 'Get paid if delayed', id: 'Tertunda? Dapat kompensasi' },
        subtitle: { en: 'Compensation when your flight is disrupted.', id: 'Kompensasi saat penerbanganmu terganggu.' },
      },
      sms: {
        en: 'tiket.com: Get paid if your flight is delayed. Add Flight Delay Service for compensation on every disruption.',
        id: 'tiket.com: Dapat kompensasi jika penerbangan tertunda. Tambahkan Flight Delay Service sekarang.',
      },
    },
  },
  {
    id: 'opt-bh-4',
    variationId: 'var-benefit',
    name: 'Option 4 — UX + WIN',
    createdAt: t,
    copy: {
      whatsapp: {
        en: 'Don’t let a delay derail your plans. Add Flight Delay Service and receive compensation if your flight is delayed or cancelled. Small cost. Real backup.',
        id: 'Jangan biarkan delay mengacaukan rencanamu. Tambahkan Flight Delay Service dan terima kompensasi jika penerbangan tertunda atau dibatalkan. Biaya kecil. Perlindungan nyata.',
      },
      push: {
        title: { en: 'Delay? You’re covered', id: 'Delay? Kamu tetap aman' },
        subtitle: { en: 'Compensation for disruptions — add it before you fly.', id: 'Kompensasi jika terganggu — tambahkan sebelum terbang.' },
      },
      sms: {
        en: 'tiket.com: Delay? You’re covered. Add Flight Delay Service for compensation if your flight is delayed or cancelled.',
        id: 'tiket.com: Delay? Kamu tetap aman. Tambahkan Flight Delay Service untuk kompensasi jika tertunda/dibatalkan.',
      },
    },
  },
  {
    id: 'opt-sp-1',
    variationId: 'var-social',
    name: 'Option 1 — Travelers',
    createdAt: t,
    copy: {
      whatsapp: {
        en: 'Thousands of tiket.com travelers add Flight Delay Service before they fly. Join them and get compensation if your flight is delayed or cancelled.',
        id: 'Ribuan traveler tiket.com menambahkan Flight Delay Service sebelum terbang. Ikuti mereka dan dapatkan kompensasi jika penerbanganmu tertunda atau dibatalkan.',
      },
      push: {
        title: { en: 'Travelers add this ✈️', id: 'Traveler lain menambah ini' },
        subtitle: { en: 'Join thousands who fly with extra protection.', id: 'Bergabunglah dengan ribuan traveler terlindungi.' },
      },
      sms: {
        en: 'tiket.com: Thousands of travelers add Flight Delay Service before flying. Join them and get compensation for delays.',
        id: 'tiket.com: Ribuan traveler menambahkan Flight Delay Service sebelum terbang. Dapatkan kompensasi jika delay.',
      },
    },
  },
  {
    id: 'opt-sp-2',
    variationId: 'var-social',
    name: 'Option 2 — Proof',
    createdAt: t,
    copy: {
      whatsapp: {
        en: 'Most travelers who add Flight Delay Service say it gives them peace of mind. If your flight is disrupted, you’re not left covering the cost alone.',
        id: 'Sebagian besar traveler yang menambah Flight Delay Service merasa lebih tenang. Jika penerbangan terganggu, kamu tidak menanggung biayanya sendiri.',
      },
      push: {
        title: { en: 'Peace of mind, booked', id: 'Tenang sejak dipesan' },
        subtitle: { en: 'Travelers choose FDS for unexpected delays.', id: 'Traveler pilih FDS untuk antisipasi delay.' },
      },
      sms: {
        en: 'tiket.com: Most travelers say Flight Delay Service gives peace of mind. Add it and stay covered on your next trip.',
        id: 'tiket.com: Sebagian besar traveler merasa tenang dengan Flight Delay Service. Tambahkan untuk perjalanan berikutnya.',
      },
    },
  },
  {
    id: 'opt-combo-1',
    variationId: 'var-combo',
    name: 'Option 1 — Combined',
    createdAt: t,
    copy: {
      whatsapp: {
        en: 'Protect your trip the way thousands of tiket.com travelers already do. Add Flight Delay Service and get compensation if your flight is delayed — so a disruption doesn’t have to cost you extra.',
        id: 'Lindungi perjalananmu seperti ribuan traveler tiket.com. Tambahkan Flight Delay Service dan dapatkan kompensasi jika pesawat tertunda — gangguan tidak harus membuatmu mengeluarkan biaya ekstra.',
      },
      push: {
        title: { en: 'Covered, like they are', id: 'Terlindungi, seperti mereka' },
        subtitle: { en: 'Compensation for delays — trusted by travelers.', id: 'Kompensasi delay — dipercaya traveler.' },
      },
      sms: {
        en: 'tiket.com: Protect your trip like thousands of travelers do. Add Flight Delay Service for compensation if delayed.',
        id: 'tiket.com: Lindungi perjalananmu seperti ribuan traveler. Tambahkan Flight Delay Service untuk kompensasi delay.',
      },
    },
  },
  {
    id: 'opt-combo-2',
    variationId: 'var-combo',
    name: 'Option 2 — Benefit first',
    createdAt: t,
    copy: {
      whatsapp: {
        en: 'Get compensation when your flight is disrupted — the same backup other tiket.com travelers rely on. Add Flight Delay Service before you fly.',
        id: 'Dapatkan kompensasi saat penerbangan terganggu — perlindungan yang juga dipakai traveler tiket.com lainnya. Tambahkan Flight Delay Service sebelum terbang.',
      },
      push: {
        title: { en: 'Backup for your flight', id: 'Cadangan untuk penerbangan' },
        subtitle: { en: 'Get paid if delayed. Travelers already do this.', id: 'Dapat kompensasi jika delay. Traveler sudah pakai.' },
      },
      sms: {
        en: 'tiket.com: Get compensation when disrupted, the same backup travelers rely on. Add Flight Delay Service now.',
        id: 'tiket.com: Dapatkan kompensasi saat terganggu, backup yang dipercaya traveler. Tambahkan Flight Delay Service sekarang.',
      },
    },
  },
]
