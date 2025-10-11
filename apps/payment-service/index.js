import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

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