import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { db, events } from "@talimy/database"
import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNull,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm"

import type { CreateEventDto, UpdateEventDto } from "./dto/create-event.dto"
import type { EventQueryDto } from "./dto/event-query.dto"
import type {
  CalendarEventsListResponse,
  CalendarEventType,
  CalendarEventVisibility,
  CalendarEventView,
} from "./calendar.types"

@Injectable()
export class CalendarRepository {
  async list(query: EventQueryDto): Promise<CalendarEventsListResponse> {
    const filters = this.buildFilters(query)

    const [totalRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(events)
      .where(and(...filters))

    const total = totalRow?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / query.limit))
    const page = Math.min(query.page, totalPages)
    const offset = (page - 1) * query.limit
    const orderBy = this.resolveOrderBy(query.sort, query.order)

    const rows = await db
      .select({
        id: events.id,
        tenantId: events.tenantId,
        title: events.title,
        description: events.description,
        startDate: events.startDate,
        endDate: events.endDate,
        location: events.location,
        type: events.type,
        visibility: events.visibility,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
      })
      .from(events)
      .where(and(...filters))
      .orderBy(...orderBy)
      .limit(query.limit)
      .offset(offset)

    return {
      data: rows.map((row) => this.mapRow(row)),
      meta: { page, limit: query.limit, total, totalPages },
    }
  }

  async listForVisibilityScopes(params: {
    dateFrom: "today" | string
    limit: number
    tenantId: string
    visibilityScopes: readonly CalendarEventVisibility[]
  }): Promise<CalendarEventsListResponse> {
    const resolvedDateFrom =
      params.dateFrom === "today" ? startOfCurrentDay() : new Date(params.dateFrom)
    const filters: SQL[] = [
      eq(events.tenantId, params.tenantId),
      isNull(events.deletedAt),
      inArray(events.visibility, [...params.visibilityScopes]),
      gte(events.endDate, resolvedDateFrom),
    ]

    const [totalRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(events)
      .where(and(...filters))

    const total = totalRow?.total ?? 0
    const rows = await db
      .select({
        id: events.id,
        tenantId: events.tenantId,
        title: events.title,
        description: events.description,
        startDate: events.startDate,
        endDate: events.endDate,
        location: events.location,
        type: events.type,
        visibility: events.visibility,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
      })
      .from(events)
      .where(and(...filters))
      .orderBy(asc(events.startDate), asc(events.title))
      .limit(params.limit)

    return {
      data: rows.map((row) => this.mapRow(row)),
      meta: {
        limit: params.limit,
        page: 1,
        total,
        totalPages: Math.max(1, Math.ceil(total / params.limit)),
      },
    }
  }

  async getById(tenantId: string, id: string): Promise<CalendarEventView> {
    const row = await this.findOrThrow(tenantId, id)
    return this.mapRow(row)
  }

  async create(payload: CreateEventDto): Promise<CalendarEventView> {
    const startDate = new Date(payload.startDate)
    const endDate = new Date(payload.endDate)
    this.assertDateRange(startDate, endDate)

    const [created] = await db
      .insert(events)
      .values({
        tenantId: payload.tenantId,
        title: payload.title,
        description: payload.description ?? null,
        startDate,
        endDate,
        location: payload.location ?? null,
        type: payload.type ?? "other",
        visibility: payload.visibility ?? "all",
      })
      .returning()

    if (!created) {
      throw new BadRequestException("Failed to create event")
    }

    return this.mapRow(created)
  }

  async update(tenantId: string, id: string, payload: UpdateEventDto): Promise<CalendarEventView> {
    const current = await this.findOrThrow(tenantId, id)

    const nextStart = payload.startDate ? new Date(payload.startDate) : current.startDate
    const nextEnd = payload.endDate ? new Date(payload.endDate) : current.endDate
    this.assertDateRange(nextStart, nextEnd)

    await db
      .update(events)
      .set({
        title: payload.title ?? current.title,
        description: Object.prototype.hasOwnProperty.call(payload, "description")
          ? (payload.description ?? null)
          : current.description,
        startDate: nextStart,
        endDate: nextEnd,
        location: Object.prototype.hasOwnProperty.call(payload, "location")
          ? (payload.location ?? null)
          : current.location,
        type: payload.type ?? (current.type as CalendarEventType),
        visibility: payload.visibility ?? (current.visibility as CalendarEventVisibility),
        updatedAt: new Date(),
      })
      .where(and(eq(events.id, id), eq(events.tenantId, tenantId), isNull(events.deletedAt)))

    return this.getById(tenantId, id)
  }

  async delete(tenantId: string, id: string): Promise<{ success: true }> {
    await this.findOrThrow(tenantId, id)
    await db
      .update(events)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(events.id, id), eq(events.tenantId, tenantId), isNull(events.deletedAt)))
    return { success: true }
  }

  private buildFilters(query: EventQueryDto): SQL[] {
    const filters: SQL[] = [eq(events.tenantId, query.tenantId), isNull(events.deletedAt)]

    if (query.type) {
      filters.push(eq(events.type, query.type))
    }
    if (query.visibility) {
      filters.push(eq(events.visibility, query.visibility))
    }

    const resolvedDateRange = this.resolveDateRange(query)
    if (resolvedDateRange) {
      filters.push(lte(events.startDate, resolvedDateRange.dateTo))
      filters.push(gte(events.endDate, resolvedDateRange.dateFrom))
    } else {
      if (query.dateFrom) {
        filters.push(gte(events.endDate, new Date(query.dateFrom)))
      }
      if (query.dateTo) {
        filters.push(lte(events.startDate, new Date(query.dateTo)))
      }
    }
    if (query.search?.trim()) {
      const search = `%${query.search.trim()}%`
      filters.push(
        or(
          ilike(events.title, search),
          ilike(events.description, search),
          ilike(events.location, search)
        )!
      )
    }

    return filters
  }

  private resolveOrderBy(sort: string | undefined, order: "asc" | "desc") {
    const direction = order === "asc" ? asc : desc
    switch (sort) {
      case "title":
        return [direction(events.title), asc(events.startDate)] as const
      case "type":
        return [direction(events.type), asc(events.startDate)] as const
      case "visibility":
        return [direction(events.visibility), asc(events.startDate)] as const
      case "endDate":
        return [direction(events.endDate), asc(events.startDate)] as const
      case "updatedAt":
        return [direction(events.updatedAt)] as const
      case "createdAt":
        return [direction(events.createdAt)] as const
      case "startDate":
      default:
        return [direction(events.startDate), asc(events.title)] as const
    }
  }

  private async findOrThrow(tenantId: string, id: string) {
    const [row] = await db
      .select({
        id: events.id,
        tenantId: events.tenantId,
        title: events.title,
        description: events.description,
        startDate: events.startDate,
        endDate: events.endDate,
        location: events.location,
        type: events.type,
        visibility: events.visibility,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
      })
      .from(events)
      .where(and(eq(events.id, id), eq(events.tenantId, tenantId), isNull(events.deletedAt)))
      .limit(1)

    if (!row) {
      throw new NotFoundException("Event not found")
    }

    return row
  }

  private resolveDateRange(query: EventQueryDto): { dateFrom: Date; dateTo: Date } | null {
    if (query.month) {
      const [yearToken, monthToken] = query.month.split("-")
      const year = Number(yearToken)
      const monthIndex = Number(monthToken) - 1

      if (
        !Number.isInteger(year) ||
        !Number.isInteger(monthIndex) ||
        monthIndex < 0 ||
        monthIndex > 11
      ) {
        throw new BadRequestException("Invalid month")
      }

      return {
        dateFrom: new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0)),
        dateTo: new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999)),
      }
    }

    if (!query.dateFrom || !query.dateTo) {
      return null
    }

    return {
      dateFrom: new Date(query.dateFrom),
      dateTo: new Date(query.dateTo),
    }
  }

  private assertDateRange(startDate: Date, endDate: Date) {
    if (Number.isNaN(startDate.getTime())) {
      throw new BadRequestException("Invalid startDate")
    }
    if (Number.isNaN(endDate.getTime())) {
      throw new BadRequestException("Invalid endDate")
    }
    if (endDate.getTime() < startDate.getTime()) {
      throw new BadRequestException("endDate must be greater than or equal to startDate")
    }
  }

  private mapRow(row: {
    id: string
    tenantId: string
    title: string
    description: string | null
    startDate: Date
    endDate: Date
    location: string | null
    type: string
    visibility: string
    createdAt: Date
    updatedAt: Date
  }): CalendarEventView {
    return {
      id: row.id,
      tenantId: row.tenantId,
      title: row.title,
      description: row.description,
      startDate: row.startDate.toISOString(),
      endDate: row.endDate.toISOString(),
      location: row.location,
      type: row.type as CalendarEventType,
      visibility: row.visibility as CalendarEventVisibility,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }
  }
}

function startOfCurrentDay() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
}
