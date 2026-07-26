import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import type { FounderWorkspacePreferences } from "@grayscale/platform";
import { FounderPreferencesService } from "./founder-preferences.service";
import { CurrentUser } from "../auth/auth.decorators";

@ApiTags("founder")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("founder")
export class FounderExperienceController {
  constructor(private readonly preferences: FounderPreferencesService) {}

  @Get("preferences")
  getPreferences(@CurrentUser() user: { userId: string }) {
    return this.preferences.getPreferences(user.userId);
  }

  @Patch("preferences")
  updatePreferences(
    @CurrentUser() user: { userId: string },
    @Body() body: Partial<FounderWorkspacePreferences>,
  ) {
    return this.preferences.updatePreferences(user.userId, body);
  }
}
