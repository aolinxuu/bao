import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
})

const BOT_WAITLIST_URL = process.env.BOT_WAITLIST_URL ?? 'https://mimi-sf-bot.fly.dev/waitlist'
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER ?? '16283016836'

function chatUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

// The bot's admission queue reads its own waitlist table, so every signup goes there. The key lets the
// bot rate-limit each visitor's IP instead of Vercel's. Returns the bot's error code, or null when the
// signup is stored or the bot couldn't be reached (the Redis copy below still holds it).
async function addToBot(request, phone, sms) {
  const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim()
  try {
    const r = await fetch(BOT_WAITLIST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WAITLIST_FORWARD_KEY ?? ''}`,
        ...(ip && { 'X-Client-IP': ip }),
      },
      body: JSON.stringify({ phone, channel: 'whatsapp', consent: sms === 'yes', source: 'getgoodo.com' }),
      signal: AbortSignal.timeout(5000),
    })
    if (r.ok) return null
    const { error } = await r.json().catch(() => ({}))
    if (r.status === 422 || r.status === 429) return error ?? 'rejected'
    console.error('waitlist forward failed', r.status, error)
  } catch (e) {
    console.error('waitlist forward failed', e)
  }
  return null
}

export async function POST(request) {
  const body = (await request.json().catch(() => null)) ?? {}
  const phone = String(body.phone ?? '').trim()
  const code = String(body.code ?? '').trim()
  const digits = phone.replace(/\D/g, '')
  // The SMS box starts unchecked; only a checked box is consent to texts.
  const sms = body.sms === 'yes' ? 'yes' : 'no'

  if (digits.length < 7 || digits.length > 15 || /[^\d\s()+.-]/.test(phone)) {
    return Response.json({ error: 'Check your phone number.' }, { status: 400 })
  }

  const error = await addToBot(request, phone, sms)
  if (error === 'rate_limited') return Response.json({ error: 'Too many tries. Try again later.' }, { status: 429 })
  if (error) return Response.json({ error: 'Check your phone number. Outside the US, start with +.' }, { status: 400 })

  // Keyed by phone digits, so joining twice updates the same entry. The first join time wins.
  const key = `signup:${digits}`
  const now = Date.now()
  const tx = redis.multi()
  tx.hset(key, code ? { phone, sms, code } : { phone, sms })
  tx.hsetnx(key, 'at', new Date(now).toISOString())
  tx.zadd('signups', { nx: true }, { score: now, member: digits })
  await tx.exec()

  // The bot can only reach someone who has messaged it, so the signup isn't finished until they do.
  // Plain "Hi!": the bot answers a greeting with "you're on the list" or "you're in", not a search.
  if (!code) return Response.json({ chat: chatUrl('Hi!') })
  // The bot checks the code when they send it: a friend's code skips the line, a wrong one just
  // leaves them on the waitlist (as the bot's /i/<code> page does).
  return Response.json({ url: chatUrl(`Hi Peku! My code is ${code}`) })
}
