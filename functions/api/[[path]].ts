import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono<{ Bindings: { LUMI_KV: KVNamespace } }>().basePath('/api')

const DEFAULT_TOOLS = [
  {
    id: 'palette-of-me',
    title: '私を構成する成分表',
    description: '友達に答えてもらう、私のカラーパレット',
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400',
    url: '/tools/palette-of-me',
    external: false,
    tag: 'Original'
  },
  {
    id: 'example-external',
    title: 'ときめき診断',
    description: '外部の面白い診断サイトへのリンク例',
    image: 'https://images.unsplash.com/photo-1523554888454-84137e72c3ce?q=80&w=400',
    url: 'https://example.com/quiz',
    external: true,
    tag: 'External'
  }
]

// ツール一覧の取得
app.get('/tools', async (c) => {
  try {
    if (!c.env.LUMI_KV) {
      console.warn('LUMI_KV is not bound. Returning default tools.')
      return c.json(DEFAULT_TOOLS)
    }

    const toolsJson = await c.env.LUMI_KV.get('tools')
    let tools = toolsJson ? JSON.parse(toolsJson) : []

    if (tools.length === 0) {
      tools = DEFAULT_TOOLS
    }
    return c.json(tools)
  } catch (e) {
    console.error('Error fetching tools:', e)
    return c.json(DEFAULT_TOOLS)
  }
})

// セッション作成
app.post('/palette/create', async (c) => {
  try {
    if (!c.env.LUMI_KV) {
      return c.json({ error: 'Database (KV) is not bound. Please check Cloudflare settings.' }, 500)
    }

    const { name } = await c.req.json()
    if (!name) return c.json({ error: 'Name is required' }, 400)

    const id = Math.random().toString(36).substring(2, 10)
    const session = {
      id,
      creatorName: name,
      createdAt: Date.now(),
    }

    // 24時間で期限切れ
    await c.env.LUMI_KV.put(`palette:${id}`, JSON.stringify(session), { expirationTtl: 86400 })

    return c.json({ id })
  } catch (e) {
    return c.json({ error: 'Failed to create session' }, 500)
  }
})

// セッション取得
app.get('/palette/:id', async (c) => {
  try {
    if (!c.env.LUMI_KV) {
      return c.json({ error: 'Database (KV) is not bound.' }, 500)
    }

    const id = c.req.param('id')
    const sessionJson = await c.env.LUMI_KV.get(`palette:${id}`)
    if (!sessionJson) return c.json({ error: 'Not Found' }, 404)
    return c.json(JSON.parse(sessionJson))
  } catch (e) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export const onRequest = handle(app)
