import {Body,Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';

@Controller('coffees')

export class CoffeesController {
    //constructor to inject a dependece
    //1st, private access modifier, TypeScripts allow declare and initialize the CoffeesService
    //2nd good practice, but this help us ensure that we arent modifying service referenced
    //3rd namig our parameter, calling it "coffeeService", very clear and readable for others.
    constructor(private readonly coffeesService: CoffeesService){}
    //the string in the GET add the endpoint

    @Get('')
    findAllPagination(@Query() paginationQuery: PaginationQueryDto){
        //const{limit,offset}=paginationQuery;

        return this.coffeesService.findAll(paginationQuery)
    }

    //@Get('')
    //allCoffeeMethod( ){
    //    return this.coffeesService.findAll();
    //}

    //dinamic Params to endpoint
    @Get(':id')
    //if we pass only 1 params
    findOne(@Param('id') id:string){
        return this.coffeesService.findOne(id)
        //COMILLAS REVERSAS PARA INVOCAR LA VARIABLE o acentos-> `  `
        //return `This action will return #${id} coffees`;
    }

    // @Post()
    // //With httpCode yo can return a specifc code to responds
    // @HttpCode(HttpStatus.GONE )
    // //if we pass the name of params in Body(), only we will read this params
    // //this can be used to validate param,
    // create(@Body() body){

    //     return this.coffeesService.create(body);
    // }

    @Post()
    create(@Body() CreateCoffeDto : CreateCoffeDto){
        return this.coffeesService.create(CreateCoffeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() UpdateCoffeDto:UpdateCoffeDto){
        return this.coffeesService.update(id,UpdateCoffeDto)
        //return `This action will updates #${id} coffees`;
    }

    @Delete(':id')
    remove(@Param('id') id:string){
        return this.coffeesService.remove(id)
        //return `This action will remove  #${id} coffees`;
    }
}
