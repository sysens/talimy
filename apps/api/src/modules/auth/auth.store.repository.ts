import bcrypt from "bcrypt"
import { db, tenants, users } from "@talimy/database"
import { and, eq, isNull } from "drizzle-orm"
import { Injectable } from "@nestjs/common"

import { getAuthConfig } from "@/config/auth.config"
import { CacheService } from "@/modules/cache/cache.service"

import type { StoredRole, StoredUser } from "./auth.types"

@Injectable()
export class AuthStoreRepository {
  private readonly refreshTokenTtlSec = getAuthConfig().refreshTokenTtlSec
  private static readonly BCRYPT_ROUNDS = 12

  constructor(private readonly cacheService: CacheService) {}

  async getUserByEmail(email: string, tenantId?: string): Promise<StoredUser | null> {
    return this.findUserByEmail(this.normalizeEmail(email), {
      tenantId,
    })
  }

  async getUserById(userId: string, tenantId: string): Promise<StoredUser | null> {
    const [row] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        tenantId: users.tenantId,
        tenantSlug: tenants.slug,
        passwordHash: users.passwordHash,
        role: users.role,
        genderScope: users.genderScope,
      })
      .from(users)
      .innerJoin(tenants, eq(users.tenantId, tenants.id))
      .where(
        and(
          eq(users.id, userId),
          eq(users.tenantId, tenantId),
          eq(users.isActive, true),
          isNull(users.deletedAt),
          isNull(tenants.deletedAt)
        )
      )
      .limit(1)

    if (!row) {
      return null
    }

    return {
      id: row.id,
      fullName: `${row.firstName} ${row.lastName}`.trim(),
      email: row.email,
      tenantId: row.tenantId,
      tenantSlug: row.tenantSlug,
      passwordHash: row.passwordHash,
      roles: [row.role],
      genderScope: row.genderScope,
    }
  }

  async getUserByEmailForRole(email: string, role: StoredRole): Promise<StoredUser | null> {
    return this.findUserByEmail(this.normalizeEmail(email), { role })
  }

  async hasUserByEmail(email: string, tenantId?: string): Promise<boolean> {
    const user = await this.getUserByEmail(email, tenantId)
    return user !== null
  }

  async saveUser(user: StoredUser): Promise<void> {
    const [firstName, ...rest] = user.fullName.trim().split(/\s+/)
    const lastName = rest.join(" ") || "-"

    await db.insert(users).values({
      id: user.id,
      tenantId: user.tenantId,
      email: this.normalizeEmail(user.email),
      passwordHash: user.passwordHash,
      firstName: firstName || user.fullName,
      lastName,
      role: (user.roles[0] ?? "school_admin") as StoredRole,
      genderScope: user.genderScope,
      isActive: true,
    })
  }

  async getTenantIdBySlug(slug: string): Promise<string | null> {
    const [tenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .where(and(eq(tenants.slug, slug), eq(tenants.status, "active"), isNull(tenants.deletedAt)))
      .limit(1)

    return tenant?.id ?? null
  }

  async updatePasswordByUser(userId: string, tenantId: string, password: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(password, AuthStoreRepository.BCRYPT_ROUNDS)

    const result = await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, userId), eq(users.tenantId, tenantId), isNull(users.deletedAt)))

    return result.rowCount > 0
  }

  async markUserLoggedIn(userId: string, tenantId: string): Promise<void> {
    await db
      .update(users)
      .set({
        lastLogin: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, userId), eq(users.tenantId, tenantId), isNull(users.deletedAt)))
  }

  async setSessionsRevokedAfter(userId: string, revokedAfterEpochSeconds: number): Promise<void> {
    await this.cacheService.setJson(this.revokedAfterKey(userId), { revokedAfterEpochSeconds })
  }

  async getSessionsRevokedAfter(userId: string): Promise<number | null> {
    const record = await this.cacheService.getJson<{ revokedAfterEpochSeconds?: number }>(
      this.revokedAfterKey(userId)
    )

    return typeof record?.revokedAfterEpochSeconds === "number"
      ? record.revokedAfterEpochSeconds
      : null
  }

  async revokeRefreshJti(jti: string): Promise<void> {
    await this.revokeRefreshJtiWithTtl(jti, this.refreshTokenTtlSec)
  }

  async revokeRefreshJtiWithTtl(jti: string, ttlSec: number): Promise<void> {
    await this.cacheService.setJson(this.revocationKey(jti), { revoked: true }, ttlSec)
  }

  async isRefreshJtiRevoked(jti: string): Promise<boolean> {
    const cached = await this.cacheService.getJson<{ revoked: boolean }>(this.revocationKey(jti))
    return cached?.revoked === true
  }

  private async findUserByEmail(
    normalizedEmail: string,
    filters: {
      role?: StoredRole
      tenantId?: string
    }
  ): Promise<StoredUser | null> {
    const [row] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        tenantId: users.tenantId,
        tenantSlug: tenants.slug,
        passwordHash: users.passwordHash,
        role: users.role,
        genderScope: users.genderScope,
      })
      .from(users)
      .innerJoin(tenants, eq(users.tenantId, tenants.id))
      .where(
        and(
          eq(users.email, normalizedEmail),
          filters.tenantId ? eq(users.tenantId, filters.tenantId) : undefined,
          filters.role ? eq(users.role, filters.role) : undefined,
          eq(users.isActive, true),
          isNull(users.deletedAt),
          isNull(tenants.deletedAt)
        )
      )
      .limit(1)

    if (!row) {
      return null
    }

    return {
      id: row.id,
      fullName: `${row.firstName} ${row.lastName}`.trim(),
      email: row.email,
      tenantId: row.tenantId,
      tenantSlug: row.tenantSlug,
      passwordHash: row.passwordHash,
      roles: [row.role],
      genderScope: row.genderScope,
    }
  }

  private normalizeEmail(email: string): string {
    return email.toLowerCase()
  }

  private revocationKey(jti: string): string {
    return `auth:refresh-revoked:${jti}`
  }

  private revokedAfterKey(userId: string): string {
    return `auth:user-revoked-after:${userId}`
  }
}
