const  { env } = process;

export const HOST=env.HOST;
export const PORT=Number(env.PORT) || 8081;
export const DB_STRING=env.DB_STRING || '@localhost:5432/postgres'

export const PG_USER='postgres'
export const PG_PASSWORD='password'
export const PG_HOST='localhost'
export const PG_PORT='5432'
export const PG_DATABASE='dynaUsers'

