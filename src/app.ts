import fastify from 'fastify'
import { authRoutes } from './routes/auth'

const app = fastify()

app.register(authRoutes, {
  prefix: 'auth',
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('server is running on http://localhost:3333'))
