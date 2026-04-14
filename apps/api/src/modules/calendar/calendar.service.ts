import { Injectable } from "@nestjs/common"
import type { EventsMeQueryInput } from "@talimy/shared"

import type { CreateEventDto, UpdateEventDto } from "./dto/create-event.dto"
import type { EventQueryDto } from "./dto/event-query.dto"
import type { CalendarEventVisibility } from "./calendar.types"
import { CalendarRepository } from "./calendar.repository"

@Injectable()
export class CalendarService {
  constructor(private readonly repository: CalendarRepository) {}

  list(query: EventQueryDto) {
    return this.repository.list(query)
  }

  listForCurrentUser(
    query: EventsMeQueryInput,
    visibilityScopes: readonly CalendarEventVisibility[]
  ) {
    return this.repository.listForVisibilityScopes({
      dateFrom: query.dateFrom,
      limit: query.limit,
      tenantId: query.tenantId,
      visibilityScopes,
    })
  }

  getById(tenantId: string, id: string) {
    return this.repository.getById(tenantId, id)
  }

  create(payload: CreateEventDto) {
    return this.repository.create(payload)
  }

  update(tenantId: string, id: string, payload: UpdateEventDto) {
    return this.repository.update(tenantId, id, payload)
  }

  delete(tenantId: string, id: string) {
    return this.repository.delete(tenantId, id)
  }
}
