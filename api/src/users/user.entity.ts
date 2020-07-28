import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm"

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ unique: true })
  public email: string

  @Column()
  public name: string

  @Column()
  public password: string

  @ManyToMany(() => User)
  @JoinTable()
  public friends: User[]
}

export default User
