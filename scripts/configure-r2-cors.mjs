import { readFileSync } from 'node:fs'
import { PutBucketCorsCommand, S3Client } from '@aws-sdk/client-s3'

const accountId = process.env.R2_ACCOUNT_ID
const accessKeyId = process.env.R2_ACCESS_KEY_ID
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const bucketName = process.env.R2_BUCKET_NAME

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error(
    'Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME env vars.',
  )
  process.exit(1)
}

const origins = process.env.R2_ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) ?? [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8787',
  'http://127.0.0.1:8787',
]

const corsRules = JSON.parse(readFileSync(new URL('../r2-cors.json', import.meta.url), 'utf8'))
corsRules.CORSRules[0].AllowedOrigins = origins

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

await client.send(
  new PutBucketCorsCommand({
    Bucket: bucketName,
    CORSConfiguration: corsRules,
  }),
)

console.log(`CORS applied to bucket "${bucketName}" for origins: ${origins.join(', ')}`)
