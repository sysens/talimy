import "./instrument"

import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"

import { AppModule } from "./app.module"
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import { TimeoutInterceptor } from "./common/interceptors/timeout.interceptor"
import { TransformInterceptor } from "./common/interceptors/transform.interceptor"
import { mountTrpcHttpAdapter } from "./trpc/trpc-http-adapter"

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const httpAdapter = app.getHttpAdapter().getInstance()

  app.setGlobalPrefix("api")
  app.enableCors({
    origin: ["https://talimy.space", "https://platform.talimy.space", /\.talimy\.space$/],
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  )
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor(),
    new TransformInterceptor()
  )
  app.useGlobalFilters(new AllExceptionsFilter())
  mountTrpcHttpAdapter(app)

  httpAdapter.get("/", (_request: unknown, response: { status: (code: number) => { json: (body: object) => void } }) => {
    response.status(200).json({
      success: true,
      data: {
        name: "Talimy API",
        status: "ok",
      },
    })
  })

  httpAdapter.get(
    "/robots.txt",
    (
      _request: unknown,
      response: {
        status: (code: number) => {
          type: (value: string) => { send: (body: string) => void }
        }
      }
    ) => {
      response
        .status(200)
        .type("text/plain")
        .send("User-agent: *\nDisallow: /\n")
    }
  )

  httpAdapter.get(
    "/.well-known/appspecific/com.chrome.devtools.json",
    (_request: unknown, response: { status: (code: number) => { end: () => void } }) => {
      response.status(204).end()
    }
  )

  const port = Number(process.env.PORT ?? 4000)
  await app.listen(port)
}

void bootstrap()
