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
}
