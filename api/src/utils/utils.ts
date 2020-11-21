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

interface CookieParams {
  [key: string]: string
}

export const getCookieParams = (cookie: string): CookieParams =>
  cookie.split(/; ?/).reduce((acc: CookieParams, param): CookieParams => {
    const [key, value] = param.split("=")
    acc[key] = value || ""

    return acc
  }, {})

export const convertToArray = <T>(obj: T): T[keyof T][] => {
  const array = []
  let index = 0

  while (true) {
    if (!obj.hasOwnProperty(index)) {
      break
    }

    array.push(obj[index++])
  }

  return array
}
