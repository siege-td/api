import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Test {
    @PrimaryGeneratedColumn()
    id!: number
}