import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DIRECT_URL, max: 1 })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const paintings = [
  {
    title: 'Amurg la Dunăre',
    slug: 'amurg-la-dunare',
    description:
      'Un peisaj captivant surprins în lumina caldă a amurgului pe malul Dunării. Culorile vii ale cerului se reflectă în apele calme ale fluviului, creând o atmosferă de pace și contemplare.',
    priceBani: 150000,
    imageUrl: 'https://placehold.co/600x800/C4824A/F5F0E8.jpg',
    imageKey: 'seed/painting-1.jpg',
    widthCm: 60,
    heightCm: 80,
    year: 2024,
    medium: 'Ulei pe pânză',
    dominantColor: '#C4824A',
  },
  {
    title: 'Florărie de toamnă',
    slug: 'florarit-de-toamna',
    description:
      'O natură statică cu flori de toamnă — crizanteme galbene și portocalii — aranjate într-o vază de ceramică tradițională românească. Lumina naturală modelează fiecare petal cu delicatețe.',
    priceBani: 80000,
    imageUrl: 'https://placehold.co/600x800/D4924A/F5F0E8.jpg',
    imageKey: 'seed/painting-2.jpg',
    widthCm: 40,
    heightCm: 50,
    year: 2023,
    medium: 'Acrilice pe carton',
    dominantColor: '#D4924A',
  },
  {
    title: 'Peisaj de munte',
    slug: 'peisaj-de-munte',
    description:
      'Munții Carpați în haina albă a iernii. Păduri de brad acoperite de zăpadă, un cer senin de un albastru profund și liniștea desăvârșită a naturii nealterate.',
    priceBani: 200000,
    imageUrl: 'https://placehold.co/600x800/6B8EA3/F5F0E8.jpg',
    imageKey: 'seed/painting-3.jpg',
    widthCm: 70,
    heightCm: 90,
    year: 2024,
    medium: 'Ulei pe pânză',
    dominantColor: '#6B8EA3',
  },
]

async function main() {
  console.log('Seeding database...')
  for (const painting of paintings) {
    await prisma.painting.upsert({
      where: { slug: painting.slug },
      update: {},
      create: painting,
    })
    console.log(`  ✓ ${painting.title}`)
  }
  console.log('Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
