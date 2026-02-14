import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('PhotoGuru API Documentation')
  .setDescription(
    'API system for connecting Photographer & Customer applications',
  )
  .setVersion('1.0')
  .addTag(
    'Auth',
    'Account authentication APIs (Register, Login, Logout, Refresh)',
  )
  .addTag('Concepts', 'APIs for searching and discovering photo concepts')
  .addTag('Users', 'APIs for managing user information')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter Access Token here',
      in: 'header',
    },
    'access-token',
  )
  .build();
