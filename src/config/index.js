const  { env } = process;

export const HOST = env.HOST;
export const PORT = Number(env.PORT) || 8081;
export const DB_STRING = env.DB_STRING || '@localhost:5432/postgres'
