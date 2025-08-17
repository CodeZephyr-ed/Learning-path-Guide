import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.sub }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export function setAuthCookie(res, userId) {
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: String(userId), expiresIn: '7d' })
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookie(res) {
  res.clearCookie('token')
}


