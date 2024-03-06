import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('images', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.string('title').notNullable()
    table.string('url').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('images')
}
