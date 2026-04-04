import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common"

import type { CurrentUser } from "@/common/decorators/current-user.decorator"
import { AuthService } from "../auth/auth.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { ListUsersQueryDto } from "./dto/list-users-query.dto"
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto"
import { UpdateMyGenderScopeDto } from "./dto/update-my-gender-scope.dto"
import { UpdateUserAvatarDto } from "./dto/update-user-avatar.dto"
import { UpdateUserRoleDto } from "./dto/update-user-role.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UsersRepository } from "./users.repository"

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly authService: AuthService
  ) {}

  list(query: ListUsersQueryDto) {
    return this.repository.list(query)
  }

  getById(tenantId: string, id: string) {
    return this.repository.getById(tenantId, id)
  }

  create(actor: CurrentUser | null, payload: CreateUserDto) {
    this.assertGenderScopeMutationAllowed(actor, payload.genderScope)
    return this.repository.create(payload)
  }

  update(actor: CurrentUser | null, tenantId: string, id: string, payload: UpdateUserDto) {
    this.assertGenderScopeMutationAllowed(actor, payload.genderScope)
    return this.repository.update(tenantId, id, payload)
  }

  delete(tenantId: string, id: string) {
    return this.repository.delete(tenantId, id)
  }

  changeRole(tenantId: string, id: string, payload: UpdateUserRoleDto) {
    return this.repository.changeRole(tenantId, id, payload.role)
  }

  changePassword(tenantId: string, id: string, payload: ChangeUserPasswordDto) {
    return this.repository.changePassword(tenantId, id, payload.newPassword)
  }

  updateAvatar(tenantId: string, id: string, payload: UpdateUserAvatarDto) {
    return this.repository.updateAvatar(tenantId, id, payload.avatar)
  }

  getMyGenderScopeSettings(actor: CurrentUser | null) {
    const currentUser = this.assertCurrentSchoolAdmin(actor)
    return this.repository.getSchoolAdminGenderScopeSettings(currentUser.tenantId, currentUser.id)
  }

  async updateMyGenderScope(actor: CurrentUser | null, payload: UpdateMyGenderScopeDto) {
    const currentUser = this.assertCurrentSchoolAdmin(actor)
    const settings = await this.repository.updateSchoolAdminGenderScope(
      currentUser.tenantId,
      currentUser.id,
      payload.genderScope
    )
    const session = await this.authService.reissueSessionForUser(
      currentUser.id,
      currentUser.tenantId
    )

    return {
      settings,
      session,
    }
  }

  private assertCurrentSchoolAdmin(
    actor: CurrentUser | null
  ): Required<Pick<CurrentUser, "id" | "tenantId">> {
    if (!actor?.id || !actor.tenantId) {
      throw new UnauthorizedException("Authenticated user context is required")
    }

    if (!actor.roles?.includes("school_admin")) {
      throw new ForbiddenException("Only school admins can manage gender scope settings")
    }

    return {
      id: actor.id,
      tenantId: actor.tenantId,
    }
  }

  private assertGenderScopeMutationAllowed(
    actor: CurrentUser | null,
    genderScope: UpdateUserDto["genderScope"] | CreateUserDto["genderScope"]
  ): void {
    if (!genderScope) {
      return
    }

    if (!actor?.roles?.includes("platform_admin")) {
      throw new ForbiddenException(
        "Only platform admins can assign gender scope through generic user management"
      )
    }
  }
}
