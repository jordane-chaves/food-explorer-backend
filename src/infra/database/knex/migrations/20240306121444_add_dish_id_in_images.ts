import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('images', (table) => {
    table.uuid('dish_id').unique().nullable().references('id').inTable('dishes')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('images', (table) => {
    table.dropColumn('dish_id')
  })
}
