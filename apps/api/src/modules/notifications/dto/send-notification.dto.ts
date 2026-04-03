import { createZodDto } from "nestjs-zod"
import {
  markNotificationReadSchema,
  notificationScopeQuerySchema,
  notificationsQuerySchema,
  sendNotificationSchema,
  type MarkNotificationReadInput,
  type NotificationChannel,
  type NotificationType,
  type NotificationScopeQueryInput,
  type NotificationsQueryInput,
  type SendNotificationInput,
} from "@talimy/shared"

type ZodDtoClass = abstract new (...args: never[]) => object

const SendNotificationDtoBase = createZodDto(sendNotificationSchema) as ZodDtoClass
const NotificationsQueryDtoBase = createZodDto(notificationsQuerySchema) as ZodDtoClass
const NotificationScopeQueryDtoBase = createZodDto(notificationScopeQuerySchema) as ZodDtoClass
const MarkNotificationReadDtoBase = createZodDto(markNotificationReadSchema) as ZodDtoClass

export class SendNotificationDto extends SendNotificationDtoBase {}
export interface SendNotificationDto extends SendNotificationInput {}

export type { NotificationChannel, NotificationType }

export class NotificationsQueryDto extends NotificationsQueryDtoBase {}
export interface NotificationsQueryDto extends NotificationsQueryInput {}

export class NotificationScopeQueryDto extends NotificationScopeQueryDtoBase {}
export interface NotificationScopeQueryDto extends NotificationScopeQueryInput {}

export class MarkNotificationReadDto extends MarkNotificationReadDtoBase {}
export interface MarkNotificationReadDto extends MarkNotificationReadInput {}
