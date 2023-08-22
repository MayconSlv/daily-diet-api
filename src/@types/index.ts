// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      username: string
      email: string
      password: string
    }
    meals: {
      id: string
      session_id: string
      name: string
      description: string
      created_at: string
      inside_diet: boolean
    }
  }
}
