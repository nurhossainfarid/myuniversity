import app from './app'
import mongoose from 'mongoose'
import config from './app/config'
import { Server } from 'http'

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    server = app.listen(config.port, () => {
      console.log(`My app is listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()


// unhandled Rejection errors by asynchronously calling
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')

  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
});

// uncaught exceptions by synchronously calling
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  process.exit(1)
})
