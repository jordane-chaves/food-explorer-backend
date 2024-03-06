import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('dish_ingredients', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.uuid('dish_id').notNullable().references('id').inTable('dishes')
    table
      .uuid('ingredient_id')
      .notNullable()
      .references('id')
      .inTable('ingredients')

    table.unique(['dish_id', 'ingredient_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('dish_ingredients')
}
