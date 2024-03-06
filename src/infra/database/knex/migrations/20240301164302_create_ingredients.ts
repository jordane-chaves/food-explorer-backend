import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ingredients', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.string('name').unique().notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ingredients')
}
