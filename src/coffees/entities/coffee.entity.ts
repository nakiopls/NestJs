import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

//This generate the SQL table with the name class in lowercase
// if you want a different name to sql table, you can specify inside of the @Entitty('name db')
@Entity()// sql table === 'coffee'
export class Coffee {
    //To generate the primary key, this not only define the id like primary key
    //also auto increment this value for us
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    name:string;
    @Column()
    brand:string;

    @Column({default:0})
    recommendations: number;
    //With this, TypeORM now knows that flavor should store array's as JSON
    //and to make this column optional in our table
    @JoinTable()
    @ManyToMany(
        type => Flavor,
        flavor => flavor.coffees,
        {
            cascade:true // ['insert]
        }
        )
    flavors:Flavor[];
}