import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { requireAuth, setAuthCookie, clearAuthCookie } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password) return res.status(400).json({ message: 'Missing fields' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already in use' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ fullName, email, passwordHash })
    setAuthCookie(res, user._id)
    return res.status(201).json({ id: user._id, fullName: user.fullName, email: user.email })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    setAuthCookie(res, user._id)
    return res.json({ id: user._id, fullName: user.fullName, email: user.email })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
})

router.post('/logout', (req, res) => {
  clearAuthCookie(res)
  res.json({ ok: true })
})

router.get('/profile', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).lean()
  if (!user) return res.status(404).json({ message: 'Not found' })
  res.json({ id: user._id, fullName: user.fullName, email: user.email })
})

export default router


