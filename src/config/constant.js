// VARIABLES
import 'dotenv/config'
import { fileURLToPath } from 'url'
import path from 'path'
import os from 'os'

export const NODE_ENV = process.env.NODE_ENV || 'production'
export const PROTOCOL = process.env.PROTOCOL || 'http'
export const HOST_PUBLIC = process.env.HOST || 'localhost'
export const HOST_LOCAL = process.env.HOST_LOCAL || 'localhost'
export const PORT = process.env.PORT || 8080
export const RUN_MODE = process.env.RUN_MODE || 'fork'
export const SECRET_STRING = process.env.SECRET_STRING
export const PRIVATE_KEY = process.env.SECRET_STRING
export const TIME_SESSION = process.env.TIME_SESSION || 60
export const DB_MODE = process.env.DB_MODE || 'mongoDB'
export const MONGOOSE_URI = process.env.MONGOOSE_URI
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)
export const nroCPUs = os.cpus().length