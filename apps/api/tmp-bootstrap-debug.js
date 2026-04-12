require("./dist/instrument")
const { NestFactory } = require("@nestjs/core")
const { AppModule } = require("./dist/app.module")

;(async () => {
  console.log("before create")
  const app = await NestFactory.create(AppModule)
  console.log("after create")
  await app.init()
  console.log("after init")
  await app.listen(4000)
  console.log("after listen")
})().catch((error) => {
  console.error("bootstrap error", error)
})
