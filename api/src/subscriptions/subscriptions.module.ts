import { Module } from "@nestjs/common"
import { AuthenticationModule } from "../authentication/authentication.module"
import { SubscriptionsGateway } from "./subscriptions.gateway"
import { UsersModule } from "../users/users.module"

@Module({
  imports: [AuthenticationModule, UsersModule],
  controllers: [],
  providers: [SubscriptionsGateway],
  exports: [SubscriptionsGateway],
})
export class SubscriptionsModule {}
