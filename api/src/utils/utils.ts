import User from "../users/user.entity"

export const copy = <T>(obj: T): T => ({ ...obj })

type UserWithoutPassword = Exclude<User, "password">

export const removePassword = (user: User): UserWithoutPassword => {
  const userWithoutPassword = copy(user)
  delete userWithoutPassword.password

  return userWithoutPassword
}

export const removePasswords = (users: User[]): UserWithoutPassword[] =>
  users.map((user): UserWithoutPassword => removePassword(user))
