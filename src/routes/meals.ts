import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.post('/register', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inside_diet: z.boolean(),
    })

    const { name, description, inside_diet } = createMealBodySchema.parse(
      request.body,
    )

    const { sub } = request.user

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      inside_diet,
      session_id: sub,
    })

    return reply.status(201).send()
  })

  app.get('/', async (request) => {
    const { sub } = request.user

    const meals = await knex('meals').where('session_id', sub)

    return { meals }
  })

  app.get('/stats', async (request) => {
    const { sub } = request.user

    const totalMealsCount = await knex('meals')
      .where('session_id', sub)
      .count({ total: '*' })

    const totalMealInDiet = await knex('meals')
      .where({
        session_id: sub,
        inside_diet: true,
      })
      .count({ in_diet: '*' })

    const totalMealOutDiet = await knex('meals')
      .where({
        session_id: sub,
        inside_diet: false,
      })
      .count({ out_diet: '*' })

    let currentCount = 0
    let maxCount = 0

    const totalMeal = await knex('meals').where({
      session_id: sub,
    })

    for (const meal of totalMeal) {
      // eslint-disable-next-line eqeqeq
      if (meal.inside_diet === 1) {
        currentCount++
        maxCount = Math.max(maxCount, currentCount)
      } else {
        currentCount = 0
      }
    }

    return {
      totalMealsCount,
      totalMealInDiet,
      totalMealOutDiet,
      maxCount,
    }
  })

  app.get('/:id', async (request) => {
    const createMealParamasSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = createMealParamasSchema.parse(request.params)
    const { sub } = request.user

    const meal = await knex('meals').where({
      session_id: sub,
      id,
    })

    return { meal }
  })

  app.delete('/:id', async (request, reply) => {
    const createMealParamasSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = createMealParamasSchema.parse(request.params)
    const { sub } = request.user

    await knex('meals')
      .where({
        session_id: sub,
        id,
      })
      .del()

    return reply.status(204).send()
  })

  app.put('/:id', async (request, reply) => {
    const createMealParamasSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = createMealParamasSchema.parse(request.params)
    const { sub } = request.user

    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inside_diet: z.boolean(),
    })

    const { name, description, inside_diet } = createMealBodySchema.parse(
      request.body,
    )

    await knex('meals')
      .where({
        session_id: sub,
        id,
      })
      .update({
        name,
        description,
        inside_diet,
        created_at: knex.fn.now(),
      })

    return reply.status(204).send()
  })
}
