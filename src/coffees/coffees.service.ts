import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { throws } from 'assert';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
        {
            id:1,
            name:'tst coffee',
            brand:'tst brand',
            flavors:['choco','vanilla']
        }
    ];

    findAll(){
        return this.coffees
    }

    findOne(id:string){
        const coffee = this.coffees.find(item => item.id === +id);
        if (!coffee){
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return coffee
    }

    findOneFailResponse(id:string){
        const coffee = this.coffees.find(item => item.id === +id);
        if (!coffee){
            throw new HttpException(`Coffee #${id} not found`,HttpStatus.NOT_FOUND)
        }
        return coffee
    }

    create(createCoffeDto: any){
        this.coffees.push(createCoffeDto)
        return createCoffeDto
    }

    update(id:string,updateCoffeDto:any){
        const existingCoffee = this.findOne(id);
        if(existingCoffee) {
            // update the existing
        }
    }

    remove(id:string){
        const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
        if(coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex,1);
        }
    }
}
