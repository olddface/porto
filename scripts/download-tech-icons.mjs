/**
 * Downloads SVG tech icons from simple-icons into public/icon/{techname}.svg
 * Run: node scripts/download-tech-icons.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as simpleIcons from 'simple-icons'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/icon')

/** Normalized filename -> simple-icons slug */
const TECH_TO_SLUG = {
  // Portfolio seed data
  typescript: 'typescript',
  javascript: 'javascript',
  python: 'python',
  sql: 'sqlite',
  vue3: 'vuedotjs',
  vue: 'vuedotjs',
  react: 'react',
  htmlcss: 'html5',
  html: 'html5',
  html5: 'html5',
  css: 'css',
  css3: 'css',
  vite: 'vite',
  tailwind: 'tailwindcss',
  tailwindcss: 'tailwindcss',
  nodejs: 'nodedotjs',
  node: 'nodedotjs',
  express: 'express',
  restapis: 'openapiinitiative',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  redis: 'redis',
  docker: 'docker',
  git: 'git',
  githubactions: 'githubactions',
  linux: 'linux',
  vitest: 'vitest',
  playwright: 'playwright',
  supabase: 'supabase',

  // Languages
  c: 'c',
  cpp: 'cplusplus',
  cplusplus: 'cplusplus',
  csharp: 'dotnet',
  dotnet: 'dotnet',
  java: 'openjdk',
  openjdk: 'openjdk',
  go: 'go',
  golang: 'go',
  rust: 'rust',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  scala: 'scala',
  dart: 'dart',
  elixir: 'elixir',
  haskell: 'haskell',
  lua: 'lua',
  perl: 'perl',
  r: 'r',
  zig: 'zig',
  wasm: 'webassembly',
  webassembly: 'webassembly',
  bash: 'gnubash',
  shell: 'gnubash',
  gnubash: 'gnubash',
  powershell: 'powershell',
  matlab: 'matlab',
  fortran: 'fortran',
  cobol: 'cobol',
  erlang: 'erlang',
  clojure: 'clojure',
  fsharp: 'fsharp',
  ocaml: 'ocaml',
  lisp: 'commonlisp',
  groovy: 'apachegroovy',
  solidity: 'solidity',
  assembly: 'assemblyscript',

  // Frontend frameworks & libs
  angular: 'angular',
  angularjs: 'angularjs',
  svelte: 'svelte',
  nextjs: 'nextdotjs',
  next: 'nextdotjs',
  nuxt: 'nuxtdotjs',
  nuxtjs: 'nuxtdotjs',
  remix: 'remix',
  astro: 'astro',
  solidjs: 'solid',
  solid: 'solid',
  qwik: 'qwik',
  ember: 'emberdotjs',
  backbone: 'backbone',
  jquery: 'jquery',
  redux: 'redux',
  mobx: 'mobx',
  zustand: 'zustand',
  pinia: 'pinia',
  vuex: 'vuex',
  bootstrap: 'bootstrap',
  sass: 'sass',
  less: 'less',
  stylus: 'stylus',
  webpack: 'webpack',
  rollup: 'rollupdotjs',
  esbuild: 'esbuild',
  parcel: 'parcel',
  babel: 'babel',
  eslint: 'eslint',
  prettier: 'prettier',
  storybook: 'storybook',
  threejs: 'threedotjs',
  d3: 'd3',
  gsap: 'greensock',

  // Backend & APIs
  django: 'django',
  flask: 'flask',
  fastapi: 'fastapi',
  spring: 'spring',
  springboot: 'springboot',
  laravel: 'laravel',
  rails: 'rubyonrails',
  rubyonrails: 'rubyonrails',
  nestjs: 'nestjs',
  hono: 'hono',
  bun: 'bun',
  deno: 'deno',
  graphql: 'graphql',
  apollo: 'apollographql',
  swagger: 'swagger',
  openapi: 'openapiinitiative',
  grpc: 'grpc',
  rabbitmq: 'rabbitmq',
  kafka: 'apachekafka',
  nginx: 'nginx',
  apache: 'apache',

  // Databases & data
  mysql: 'mysql',
  mongodb: 'mongodb',
  sqlite: 'sqlite',
  mariadb: 'mariadb',
  oracle: 'oracle',
  dynamodb: 'amazondynamodb',
  firebase: 'firebase',
  firestore: 'firebase',
  prisma: 'prisma',
  sequelize: 'sequelize',
  typeorm: 'typeorm',
  drizzle: 'drizzle',
  elasticsearch: 'elasticsearch',
  snowflake: 'snowflake',
  databricks: 'databricks',
  airflow: 'apacheairflow',

  // Cloud & infra
  aws: 'amazonaws',
  amazonaws: 'amazonaws',
  azure: 'microsoftazure',
  gcp: 'googlecloud',
  googlecloud: 'googlecloud',
  digitalocean: 'digitalocean',
  vercel: 'vercel',
  netlify: 'netlify',
  heroku: 'heroku',
  cloudflare: 'cloudflare',
  kubernetes: 'kubernetes',
  terraform: 'terraform',
  ansible: 'ansible',
  jenkins: 'jenkins',
  gitlab: 'gitlab',
  github: 'github',
  bitbucket: 'bitbucket',
  circleci: 'circleci',
  travisci: 'travisci',
  argocd: 'argo',
  helm: 'helm',
  prometheus: 'prometheus',
  grafana: 'grafana',
  datadog: 'datadog',
  sentry: 'sentry',

  // Testing
  jest: 'jest',
  cypress: 'cypress',
  mocha: 'mocha',
  selenium: 'selenium',
  testinglibrary: 'testinglibrary',
  junit: 'junit',
  pytest: 'pytest',

  // Tools & platforms
  npm: 'npm',
  yarn: 'yarn',
  pnpm: 'pnpm',
  turbo: 'turbo',
  nx: 'nx',
  electron: 'electron',
  tauri: 'tauri',
  flutter: 'flutter',
  reactnative: 'react',
  expo: 'expo',
  wordpress: 'wordpress',
  figma: 'figma',
  vscode: 'visualstudiocode',
  visualstudiocode: 'visualstudiocode',
  vim: 'vim',
  neovim: 'neovim',
  dockercompose: 'docker',
  podman: 'podman',
  slack: 'slack',
  discord: 'discord',
  notion: 'notion',
  jira: 'jira',
  confluence: 'confluence',
  postman: 'postman',
  insomnia: 'insomnia',
  stripe: 'stripe',
  twilio: 'twilio',
  auth0: 'auth0',
  oauth: 'oauth',
  jwt: 'jwt',
  markdown: 'markdown',
  latex: 'latex',
  tensorflow: 'tensorflow',
  pytorch: 'pytorch',
  pandas: 'pandas',
  numpy: 'numpy',
  scikitlearn: 'scikitlearn',
  opencv: 'opencv',
  unity: 'unity',
  unrealengine: 'unrealengine',
  godot: 'godotengine',
  blender: 'blender',
  android: 'android',
  ios: 'ios',
  apple: 'apple',
  windows: 'windows11',
  macos: 'macos',
  ubuntu: 'ubuntu',
  debian: 'debian',
  fedora: 'fedora',
  archlinux: 'archlinux',
  raspberrypi: 'raspberrypi',
  arduino: 'arduino',
  mqtt: 'mqtt',
  socketio: 'socketdotio',
  websockets: 'socketdotio',
  wasmcloud: 'webassembly',
  llvm: 'llvm',
  cmake: 'cmake',
  make: 'gnu',
  gnu: 'gnu',
  homebrew: 'homebrew',
  chocolatey: 'chocolatey',
  rustup: 'rust',
  cargo: 'rust',
  maven: 'apachemaven',
  gradle: 'gradle',
  nuget: 'nuget',
  pip: 'pypi',
  pypi: 'pypi',
  conda: 'anaconda',
  anaconda: 'anaconda',
  dockerhub: 'docker',
  ghactions: 'githubactions',
  actions: 'githubactions',
}

function buildSlugIndex() {
  const bySlug = new Map()
  for (const key of Object.keys(simpleIcons)) {
    if (!key.startsWith('si')) continue
    const icon = simpleIcons[key]
    if (icon?.slug) bySlug.set(icon.slug, icon)
  }
  return bySlug
}

function toSvg(icon) {
  return `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>${icon.title}</title><path d="${icon.path}"/></svg>\n`
}

async function main() {
  const bySlug = buildSlugIndex()
  await mkdir(OUT_DIR, { recursive: true })

  const written = []
  const missing = []

  for (const [filename, slug] of Object.entries(TECH_TO_SLUG)) {
    const icon = bySlug.get(slug)
    if (!icon) {
      missing.push({ filename, slug })
      continue
    }
    const path = join(OUT_DIR, `${filename}.svg`)
    await writeFile(path, toSvg(icon), 'utf8')
    written.push(filename)
  }

  console.log(`Written ${written.length} icons to public/icon/`)

  const manifest = [...new Set(written)].sort()
  const manifestPath = join(__dirname, '../src/lib/tech-icons.json')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
  console.log(`Updated src/lib/tech-icons.json (${manifest.length} icons)`)

  if (missing.length) {
    console.warn('Missing simple-icons slugs:')
    for (const m of missing) console.warn(`  ${m.filename} -> ${m.slug}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
