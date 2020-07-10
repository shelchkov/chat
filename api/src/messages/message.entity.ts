import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

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
}

export default Message
