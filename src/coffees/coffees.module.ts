import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Connection } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

class MockCoffeeService{
}
//if we want our ConfigService to be different depending on the environment
// for example if development or
class ConfigService{}
class DevelopmentConfigService{}
class ProductionConfigService{}

/* Factory provider  */
@Injectable()
export class CoffeeBrandsFactory {
    create(){
        /* ... do something ... */
        return ['buddy brew 2','nescafe 2'];
    }
}

@Module({
    //forFeature() registers TypeORM in this child module, forRoot() is set in the app.module
    //in this array, you can pass all entitys
    imports: [TypeOrmModule.forFeature([Coffee,Flavor,Event])],
    controllers: [CoffeesController],
    providers: [CoffeesService,
        CoffeeBrandsFactory,
    {
        provide: ConfigService,
        useClass:
            process.env.NODE_ENV === 'development'
                ? DevelopmentConfigService
                : ProductionConfigService,
    },
    // {
    //     provide:COFFEE_BRANDS,
    //     useValue:['buddy brew','nescafe']
    // }
    /* THIS IS TO ADD PARAMS IN THE FACTORY PROVIDER  */
    //{
    //    provide:COFFEE_BRANDS,
    //    useFactory:  (brandsFactory:CoffeeBrandsFactory ) =>
    //        //in create we can pass argument and return
    //        //the array depending what we want
    //        brandsFactory.create(),
    //    inject: [CoffeeBrandsFactory]
    //}
    {
        provide:COFFEE_BRANDS,
        useFactory: async (connection: Connection): Promise<string[]> => {
            //Imagine we are injecting some sort of database conection
            // const coffeeBrands = await connection.query('SELECT * ...');
            const coffeeBrands = await Promise.resolve(['buddy brew ddbb', 'nescafe ddbb'])
            console.log("[!] Async factory")
            return coffeeBrands;
        },
        inject: [Connection],
    }
    ],
    exports:[CoffeesService]
})
export class CoffeesModule {}
