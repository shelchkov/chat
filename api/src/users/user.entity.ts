import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(
    () => User,
    user => user.friends,
  )
  public friend: User

  @OneToMany(
    () => User,
    user => user.friend,
  )
  public friends: User[]
}

export default User
