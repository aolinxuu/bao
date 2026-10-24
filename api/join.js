import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Valid codes: INVITE_CODE (1020), or a friend's referral code in the "invite_codes" set.
// Returns null for a wrong code.
async function statusFor(code) {
  if (!code) return 'waitlist'
  if (code === process.env.INVITE_CODE || (await redis.sismember('invite_codes', code))) return 'invited'
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

  const status = await statusFor(code)
  if (!status) return Response.json({ error: "That code didn't work." }, { status: 401 })

  // Keyed by phone digits, so joining twice updates the same entry.
  const key = `signup:${digits}`
  const now = Date.now()
  const tx = redis.multi()
  tx.hset(key, { phone, sms })
  // Status only moves forward: a later join without a code never undoes an invite.
  if (status === 'invited') tx.hset(key, { code, status })
  else tx.hsetnx(key, 'status', 'waitlist')
  // The first join time wins, in the hash and in the sorted set.
  tx.hsetnx(key, 'at', new Date(now).toISOString())
  tx.zadd('signups', { nx: true }, { score: now, member: digits })
  await tx.exec()

  if (status === 'waitlist') return Response.json({})
  const text = encodeURIComponent(`Hi Goodo! My code is ${code}`)
  return Response.json({ url: `https://wa.me/${process.env.BAO_WHATSAPP}?text=${text}` })
}
