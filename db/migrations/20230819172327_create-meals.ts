import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').references('id').inTable('users')
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.boolean('inside_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
