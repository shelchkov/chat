import User from "../../users/user.entity"

const mockedUser: User = {
  id: 1,
  email: "name@test.com",
  name: "UserName",
  password: "userPassword",
  friends: [
    {
      id: 2,
      email: "seconduser@test.com",
      name: "SecondUser",
      password: "userPassword",
      friends: [],
    },
  ],
}

export default mockedUser
