import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('dishes', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table
      .uuid('category_id')
      .notNullable()
      .references('id')
      .inTable('categories')
    table.uuid('image_id').unique().notNullable()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.integer('price_in_cents').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('dishes')
}
