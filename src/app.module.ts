import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi'
import { APP_PIPE } from '@nestjs/core';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
    }),
    CoffeesModule,
    TypeOrmModule.forRoot({
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,// from -env all data is string, but port must be int,to fix this, add '+' 
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true, // models will be loaded automatically
      //this synchronize configuration, let's typeORM automatically generate a SQL Table from all classes
      //with the @Entity() decorator and the metadata they contain
      synchronize: true, // your entities will be synced with the database(recommended: disable in prod)
    }),
    CoffeeRatingModule,
    DatabaseModule,
    CommonModule],
  controllers: [AppController],
  providers: [
    AppService,

  ],
})
export class AppModule {}


