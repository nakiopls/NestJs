import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

/* STATIC IMPLEMENTATION TO CONNECT TO DB */
// @Module({
//     providers:[
//         {
//             provide: 'CONNECTION',
//             useValue: createConnection({
//                 type: 'postgres',
//                 host: 'localhost',
//                 port: 5432
//             }),
//         }]
// })

@Module({})

// Creating static register() method on DatabaseModule
//export class DatabaseModule {
//    static register(options: ConnectionOptions): DynamicModule {  }
//  }

// Improved Dynamic Module way of creating CONNECTION provider
//in options you can pass all params to connect to DB
export class DatabaseModule {
    static register(options: ConnectionOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'CONNECTION',
                    useValue: createConnection(options),
                }
            ]
        }
    }
}
