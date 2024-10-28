import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
export default class Post extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    title: string

    @Column("text")
    content: string

    @Column("integer")
    comments: number

    @Column("integer")
    score: number

}