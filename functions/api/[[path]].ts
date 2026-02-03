import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { PRISM_QUESTIONS } from './data/questions'

const app = new Hono<{ Bindings: { LUMI_KV: KVNamespace } }>().basePath('/api')

const DEFAULT_TOOLS = [
  {
    id: 'palette-of-me',
    title: 'Nuance Palette : Me',
    description: '移ろいゆく、私を構成する色の断片',
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400',
    url: '/tools/palette-of-me',
    external: false,
    tag: 'Nuance'
  },
  {
    id: 'prism-of-me',
    title: 'Mental Fragment : Prism',
    description: '視線が織りなす、私だけの心の結晶',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400',
    url: '/tools/prism-of-me',
    external: false,
    tag: 'Crystalline'
  },
  {
    id: 'external-example',
    title: 'Lumi Magazine',
    description: '淡色女子のためのライフスタイルメディア',
    image: 'https://images.unsplash.com/photo-1516054653973-59bb77ec1499?q=80&w=400',
    url: 'https://example.com',
    external: true,
    tag: 'Magazine'
  }
]

// 既存のPalette系エンドポイントはそのまま維持
app.get('/tools', async (c) => {
  try {
    if (!c.env.LUMI_KV) return c.json(DEFAULT_TOOLS)
    const toolsJson = await c.env.LUMI_KV.get('tools')
    let tools = toolsJson ? JSON.parse(toolsJson) : []
    if (tools.length === 0) tools = DEFAULT_TOOLS
    return c.json(tools)
  } catch (e) {
    return c.json(DEFAULT_TOOLS)
  }
})

// Palette of Me
app.post('/palette/create', async (c) => {
  const { name } = await c.req.json()
  const id = Math.random().toString(36).substring(2, 10)
  const session = { id, creatorName: name, createdAt: Date.now() }
  if (c.env.LUMI_KV) await c.env.LUMI_KV.put(`palette:${id}`, JSON.stringify(session), { expirationTtl: 86400 })
  return c.json({ id })
})

app.get('/palette/:id', async (c) => {
  const id = c.req.param('id')
  if (!c.env.LUMI_KV) return c.json({ error: 'KV not found' }, 500)
  const sessionJson = await c.env.LUMI_KV.get(`palette:${id}`)
  if (!sessionJson) return c.json({ error: 'Not Found' }, 404)
  return c.json(JSON.parse(sessionJson))
})

// --- Prism of Me ---

// セッション作成
app.post('/prism/create', async (c) => {
  const { name, targetCount } = await c.req.json()
  if (!name || !targetCount) return c.json({ error: 'Missing params' }, 400)

  const id = Math.random().toString(36).substring(2, 10)

  // 100問（今回は30問）からランダムに10問選択
  const shuffled = [...PRISM_QUESTIONS].sort(() => 0.5 - Math.random())
  const selectedQuestions = shuffled.slice(0, 10)

  const session = {
    id,
    creatorName: name,
    targetCount: parseInt(targetCount),
    questionIds: selectedQuestions.map(q => q.id),
    responses: [],
    createdAt: Date.now()
  }

  if (c.env.LUMI_KV) {
    await c.env.LUMI_KV.put(`prism:${id}`, JSON.stringify(session), { expirationTtl: 86400 * 7 }) // 1週間保持
  }

  return c.json({ id })
})

// セッション取得
app.get('/prism/:id', async (c) => {
  const id = c.req.param('id')
  if (!c.env.LUMI_KV) return c.json({ error: 'KV not found' }, 500)
  const sessionJson = await c.env.LUMI_KV.get(`prism:${id}`)
  if (!sessionJson) return c.json({ error: 'Not Found' }, 404)

  const session = JSON.parse(sessionJson)
  // Filter out any undefined questions to prevent frontend crashes
  const questions = session.questionIds
    .map((qid: number) => PRISM_QUESTIONS.find(q => q.id === qid))
    .filter((q: any) => q !== undefined)

  return c.json({ ...session, questions })
})

// 回答投稿
app.post('/prism/:id/respond', async (c) => {
  const id = c.req.param('id')
  const { answers, message } = await c.req.json() // answers: { questionId: score(1-5) }

  if (!c.env.LUMI_KV) return c.json({ error: 'KV not found' }, 500)
  const sessionJson = await c.env.LUMI_KV.get(`prism:${id}`)
  if (!sessionJson) return c.json({ error: 'Not Found' }, 404)

  const session = JSON.parse(sessionJson)

  // スコア計算
  const responseScores = { static: 0, warm: 0, sharp: 0, elegant: 0, vivid: 0 }

  for (const qid in answers) {
    const question = PRISM_QUESTIONS.find(q => q.id === parseInt(qid))
    if (question) {
      const choice = answers[qid] // 1-5
      const multiplier = (choice - 3) // -2 to 2
      responseScores.static += question.weights.static * multiplier
      responseScores.warm += question.weights.warm * multiplier
      responseScores.sharp += question.weights.sharp * multiplier
      responseScores.elegant += question.weights.elegant * multiplier
      responseScores.vivid += question.weights.vivid * multiplier
    }
  }

  session.responses.push({
    scores: responseScores,
    message: message || '',
    timestamp: Date.now()
  })

  if (c.env.LUMI_KV) {
    await c.env.LUMI_KV.put(`prism:${id}`, JSON.stringify(session), { expirationTtl: 86400 * 7 })
  }

  return c.json({ success: true })
})

export const onRequest = handle(app)
