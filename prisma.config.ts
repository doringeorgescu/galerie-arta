import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // DIRECT_URL bypasses pgBouncer — required for migrations
    url: process.env.DIRECT_URL,
  },
})
