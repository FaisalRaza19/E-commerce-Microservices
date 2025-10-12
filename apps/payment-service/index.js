import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware,} from '@hono/clerk-auth'
import { authUser } from './middleware/auth_middleware.js'

const app = new Hono()

app.use(clerkMiddleware())

app.get("/test", authUser,(c) => {
  return c.json({message: 'Payment service authenticated',userId:c.get("userId")})
})

app.get('/', (c) => {
  return c.text('Hello payment service')
})

const start = async () => {
  try {
    serve({
      fetch: app.fetch,
      port: process.env.PORT
    }, (info) => {
      console.log(`Server is running on http://localhost:${info.port}`)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()