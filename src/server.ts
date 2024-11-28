import app from './app'
import mongoose from 'mongoose'
import config from './app/config'

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    app.listen(config.port, () => {
      console.log(`My app is listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()
