import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm"

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public text: string

  @Column()
  public from: number

  @Column()
  public to: number

  @CreateDateColumn()
  public createdAt: Date
}

export default Message
