import { Controller, Get, Patch, Param, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { CurrentUser } from "../auth/auth.decorators";

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(
    @CurrentUser() user: { userId: string },
    @Query("unreadOnly") unreadOnly?: string,
  ) {
    return this.notifications.list(user.userId, unreadOnly === "true");
  }

  @Patch(":id/read")
  markRead(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.notifications.markRead(id, user.userId);
  }
}
