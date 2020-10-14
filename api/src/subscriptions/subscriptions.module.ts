import { Module } from "@nestjs/common"

import { AuthenticationModule } from "../authentication/authentication.module"
import { UsersModule } from "../users/users.module"

import { SubscriptionsGateway } from "./subscriptions.gateway"
import { SubscriptionsService } from "./subscriptions.service"

@Module({
  imports: [AuthenticationModule, UsersModule],
  controllers: [],
  providers: [SubscriptionsService, SubscriptionsGateway],
  exports: [SubscriptionsGateway],
})
export class SubscriptionsModule {}
