import { Redis } from '@upstash/redis'

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const phone = String(body.phone ?? '').trim()
  const code = String(body.code ?? '').trim()
  const digits = phone.replace(/\D/g, '')
  // The SMS box starts unchecked; only a checked box is consent to texts.
  const sms = body.sms === 'yes' ? 'yes' : 'no'

  if (digits.length < 7 || digits.length > 15 || /[^\d\s()+.-]/.test(phone)) {
    return Response.json({ ok: false, error: 'Check your phone number.' }, { status: 400 })
  }

  const redis = new Redis({
    url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  // Valid codes: INVITE_CODE (1020), or a friend's referral code in the "invite_codes" set.
  const valid = code && (code === process.env.INVITE_CODE || (await redis.sismember('invite_codes', code)))
  if (code && !valid) {
    return Response.json({ ok: false, error: "That code didn't work." }, { status: 401 })
  }

  // Keyed by phone digits, so joining twice updates the same entry.
  await redis.hset(`signup:${digits}`, { phone, code, sms, status: valid ? 'invited' : 'waitlist', at: new Date().toISOString() })
  await redis.zadd('signups', { nx: true }, { score: Date.now(), member: digits })

  if (!valid) return Response.json({ ok: true })
  const text = encodeURIComponent(`Hi Bao! My code is ${code}`)
  return Response.json({ ok: true, url: `https://wa.me/${process.env.BAO_WHATSAPP}?text=${text}` })
}
