import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  // Vite may bump to 5174+ if 5173 is busy
  if (process.env.NODE_ENV !== 'production') {
    for (const port of [5173, 5174, 5175, 5176]) {
      const origin = `http://localhost:${port}`;
      if (!allowedOrigins.includes(origin)) allowedOrigins.push(origin);
    }
  }

  app.enableCors({
    origin: (requestOrigin, callback) => {
      // Allow non-browser requests (no Origin header, e.g. curl, server-to-server)
      if (!requestOrigin) return callback(null, true);

      if (allowedOrigins.includes(requestOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${requestOrigin} not allowed by CORS`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`\n🚀 Krishna Jewellers API running on http://localhost:${port}/api/v1`);
  console.log(`☁️  Image storage: Cloudinary`);
}
bootstrap();
