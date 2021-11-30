import { Column, Entity, Index } from "typeorm";

@Index(['name','type'])
@Entity()
export class Event {
    id: number;

    @Column()
    type: string;

    @Index()
    @Column()
    name: string;

    @Column('json')
    payload: Record<string, any>;
}
