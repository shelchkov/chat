import LatestMessage from "src/messages/latest-message.entity"

const mockedLatestMessage: LatestMessage = {
  id: 1,
  users: [1, 2], 
  message: {
    id: 3,
    from: 1,
    to: 2,
    text: "Message",
    createdAt: new Date(),
  }
}

export default mockedLatestMessage
