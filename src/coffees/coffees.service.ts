import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    ){
        console.log(coffeeBrands)
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const{limit,offset}=paginationQuery
        return this.coffeRepository.find({
            relations:['flavors'],
            skip:offset,
            take: limit
        });
    }

    async findOne(id:string){
        const coffee = await this.coffeRepository.findOne(id, {relations:['flavors']} );
        if (!coffee){
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return coffee
    }
    // this function used the other mockup
    //findOneFailResponse(id:string){
    //    const coffee = this.coffees.find(item => item.id === +id);
    //    if (!coffee){
    //        throw new HttpException(`Coffee #${id} not found`,HttpStatus.NOT_FOUND)
    //    }
    //    return coffee
    //}

    async create(createCoffeDto: CreateCoffeDto){
        const flavors = await Promise.all(
            createCoffeDto.flavors.map(name => this.preloadFlavorByName(name))
        )

        const coffee = this.coffeRepository.create({
            ...createCoffeDto,
            flavors
        });
        return this.coffeRepository.save(coffee)
    }

    async update(id:string,updateCoffeDto:UpdateCoffeDto){
        //preload, create a new entity based on the obj passed into
        //preload first looks to see if an entity ALREADY exist in the DB
        //and retrieves(recueprar) it and everything related to it.
        //if an entity exist already, preload repalces all of the values
        //with the new ones passed
        //NOTE, preload will return undefined if the "id" of the entity is was NOT found in the db

        const flavors =
            updateCoffeDto.flavors &&
            (await Promise.all(
                updateCoffeDto.flavors.map(name => this.preloadFlavorByName(name))
            ));
        const coffee = await this.coffeRepository.preload({
            id: +id,
            ...updateCoffeDto,
            flavors
        })
        if(!coffee){
            throw new NotFoundException(`Coffe #${id} not found`)
        }
        return this.coffeRepository.save(coffee);
    }

    async remove(id:string){
        const coffee = await this.findOne(id)
        return this.coffeRepository.remove(coffee)
    }

    /* CoffeesService - Transaction */
    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        }   catch (err) {
            await queryRunner.rollbackTransaction();
        }   finally {
            await queryRunner.release();
        }
    }

    private async preloadFlavorByName(name:string): Promise<Flavor>{
        const existingFlavor = await this.flavorRepository.findOne({name});
        if (existingFlavor){
            return existingFlavor;
        }
        return this.flavorRepository.create({name})
    }
}
