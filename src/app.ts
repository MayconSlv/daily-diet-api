import fastify from 'fastify'
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth'
import { mealRoutes } from './routes/meals'

const app = fastify()

app.register(jwt, {
  secret: 'QICK19JKK1Z032JANAEQRIMDAFS9',
})
app.register(authRoutes, {
  prefix: 'auth',
})
app.register(mealRoutes, {
  prefix: 'meal',
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('server is running on http://localhost:3333'))
