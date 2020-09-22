const mockedJwtService = {
  sign: (): string => "",
  decode: (): { userId: number } => ({ userId: 1 }),
}

export default mockedJwtService
