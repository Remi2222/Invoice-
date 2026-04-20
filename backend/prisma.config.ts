import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: 'postgresql://neondb_owner:npg_QpwIGH7XC3lV@ep-weathered-firefly-ane73o54.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require',
  },
})