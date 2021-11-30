import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Module({
    //forFeature() registers TypeORM in this child module, forRoot() is set in the app.module
    //in this array, you can pass all entitys
    imports: [TypeOrmModule.forFeature([Coffee,Flavor,Event])],
    controllers: [CoffeesController],
    providers: [CoffeesService],
})
export class CoffeesModule {}
