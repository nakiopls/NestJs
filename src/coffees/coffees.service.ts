import { Injectable } from '@nestjs/common';
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
        return this.coffees.find(item => item.id === +id);
    }

    create(createCoffeDto: any){
        this.coffees.push(createCoffeDto)
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
