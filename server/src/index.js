import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRouter from './routes/auth.js'
import skillsRouter from './routes/skills.js'
import goalsRouter from './routes/goals.js'
import gapsRouter from './routes/gaps.js'
import learningPathsRouter from './routes/learningPaths.js'
import skillsCatalogRouter from './routes/skillsCatalog.js'
import resourcesRouter from './routes/resources.js'


const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:8080', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/users/skills',skillsRouter)
app.use('/api/career-goals', goalsRouter)
app.use('/api/gaps', gapsRouter)
app.use('/api/learning-paths', learningPathsRouter)
app.use('/api/learning-resources', resourcesRouter)



const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`API listening on :${PORT}`)))
  .catch((err) => {
    console.error('MongoDB connection error', err)
    process.exit(1)
  })


