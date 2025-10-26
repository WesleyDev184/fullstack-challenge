import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import 'dotenv/config'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from './app.module'
import { ExceptionInterceptor } from './shared/interceptors/exception.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Fullstack Challenge API')
    .setDescription('The Fullstack Challenge API description')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('openapi', app, documentFactory)
  app.use(
    '/docs',
    apiReference({
      content: documentFactory,
      theme: 'deepSpace',
    }),
  )

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new ExceptionInterceptor())
  app.setGlobalPrefix('api')

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`API is running on http://localhost:${port}`)
}

void bootstrap()
