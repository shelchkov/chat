import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import Message from "./message.entity"

@Entity()
export default class LatestMessage {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("int", { array: true })
  public users: number[]

  @OneToOne(() => Message, { cascade: true })
  @JoinColumn()
  public message: Message
}
