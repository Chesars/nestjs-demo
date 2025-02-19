import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { PreloadDataProductsService } from './helpers/preloadDataProducts';
import { PreloadDataCategoriesService } from './helpers/preloadDataCategories';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as crypto from 'crypto';

Object.defineProperty(global, 'crypto', {
  value: crypto,
  writable: false,
  configurable: false
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal);
  
  
  /* 
  const preloadDataProductsService = app.get(PreloadDataProductsService);
  const preloadDataCategoriesService = app.get(PreloadDataCategoriesService);

  await preloadDataCategoriesService.preloadCategories();
  await preloadDataProductsService.preloadProducts();
  */
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Nest')
    .setDescription(
      'Esta es una API construida con Nest para ser empleada en las demos del módulo 4 de la especialidad Backend de la carrera Fullstack Development',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
