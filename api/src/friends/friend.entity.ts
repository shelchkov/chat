import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
class Friend {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  userId: number

  @Column()
  friendId: number
}

export default Friend
