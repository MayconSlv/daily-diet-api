import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3),
      username: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { name, username, email, password } = createUserBodySchema.parse(
      request.body,
    )

    await knex('users').insert({
      id: randomUUID(),
      name,
      username,
      email,
      password,
    })

    return reply.status(201).send()
  })

  app.get('/users', async () => {
    const users = await knex('users').select()

    return { users }
  })

  app.post('/login', async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
      password: z.string(),
    })

    const { username, password } = createUserBodySchema.parse(request.body)

    const user = await knex('users')
      .where({
        username,
        password,
      })
      .first()

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    const token = app.jwt.sign(
      {
        username: user.username,
      },
      {
        sub: user.id,
        expiresIn: '30 days',
      },
    )

    return {
      token,
    }
  })
}
