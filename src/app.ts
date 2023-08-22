import fastify from 'fastify'
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth'
import { mealRoutes } from './routes/meals'
import { env } from './env'

export const app = fastify()

app.register(jwt, {
  secret: env.JWT_SECRET,
})
app.register(authRoutes, {
  prefix: 'auth',
})
app.register(mealRoutes, {
  prefix: 'meal',
})
