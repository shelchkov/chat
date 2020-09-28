const mockedConfigService = {
  get(key: string): string | undefined {
    switch (key) {
      case "JWT_EXPIRATION_TIME":
        return "3600"
    }
  },
}

export default mockedConfigService
