import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common"
import {
  createEventSchema,
  eventsMeQuerySchema,
  eventsQuerySchema,
  updateEventSchema,
  userTenantQuerySchema,
  uuidStringSchema,
  type EventsMeQueryInput,
} from "@talimy/shared"

import { Roles } from "@/common/decorators/roles.decorator"
import {
  CurrentUser,
  type CurrentUser as CurrentUserType,
} from "@/common/decorators/current-user.decorator"
import { AuthGuard } from "@/common/guards/auth.guard"
import { RolesGuard } from "@/common/guards/roles.guard"
import { TenantGuard } from "@/common/guards/tenant.guard"
import { ZodParamFieldPipe } from "@/common/pipes/zod-param-field.pipe"
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe"

import { CalendarService } from "./calendar.service"
import { CreateEventDto, UpdateEventDto } from "./dto/create-event.dto"
import { EventQueryDto } from "./dto/event-query.dto"

@Controller("events")
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @Roles("platform_admin", "school_admin", "teacher", "student", "parent")
  list(@Query(new ZodValidationPipe(eventsQuerySchema)) queryInput: unknown) {
    const query = queryInput as EventQueryDto
    return this.calendarService.list(query)
  }

  @Get("me")
  @Roles("platform_admin", "school_admin", "teacher", "student", "parent")
  listForCurrentUser(
    @CurrentUser() currentUser: CurrentUserType | null,
    @Query(new ZodValidationPipe(eventsMeQuerySchema)) query: EventsMeQueryInput
  ) {
    return this.calendarService.listForCurrentUser(query, resolveVisibilityScopes(currentUser))
  }

  @Get(":id")
  @Roles("platform_admin", "school_admin", "teacher", "student", "parent")
  getById(
    @Param("id", new ZodParamFieldPipe(uuidStringSchema)) id: string,
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as { tenantId: string }
    return this.calendarService.getById(query.tenantId, id)
  }

  @Post()
  @Roles("platform_admin", "school_admin", "teacher")
  create(@Body(new ZodValidationPipe(createEventSchema)) bodyInput: unknown) {
    const body = bodyInput as CreateEventDto
    return this.calendarService.create(body)
  }

  @Patch(":id")
  @Roles("platform_admin", "school_admin", "teacher")
  update(
    @Param("id", new ZodParamFieldPipe(uuidStringSchema)) id: string,
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown,
    @Body(new ZodValidationPipe(updateEventSchema)) bodyInput: unknown
  ) {
    const query = queryInput as { tenantId: string }
    const body = bodyInput as UpdateEventDto
    return this.calendarService.update(query.tenantId, id, body)
  }

  @Delete(":id")
  @Roles("platform_admin", "school_admin", "teacher")
  delete(
    @Param("id", new ZodParamFieldPipe(uuidStringSchema)) id: string,
    @Query(new ZodValidationPipe(userTenantQuerySchema)) queryInput: unknown
  ) {
    const query = queryInput as { tenantId: string }
    return this.calendarService.delete(query.tenantId, id)
  }
}

function resolveVisibilityScopes(
  currentUser: CurrentUserType | null
): readonly ("admin" | "all" | "students" | "teachers")[] {
  const primaryRole = currentUser?.roles?.[0]

  if (!primaryRole) {
    throw new UnauthorizedException("Authenticated user is required")
  }

  if (primaryRole === "student" || primaryRole === "parent") {
    return ["all", "students"]
  }

  if (primaryRole === "teacher") {
    return ["all", "teachers"]
  }

  return ["all", "admin"]
}
