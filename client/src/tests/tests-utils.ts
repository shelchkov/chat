import { Message, User } from "../utils/interfaces";

export const userMock: User = {
  id: 1,
  email: "email@test.com",
  name: "User"
}

export const userMock2: User = {
  id: 2,
  email: "email2@test.com",
  name: "User2"
}

export const messageMock: Message = {
  id: 1,
  from: 1,
  to: 3,
  text: "Text"
}
