"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sileo } from "sileo"

import { Skeleton } from "@talimy/ui"
import { useTranslations } from "next-intl"

import {
  getTeacherDetailLeaveRequests,
  updateTeacherDetailLeaveRequest,
} from "@/components/teachers/detail/teacher-detail-api"
import { mapLeaveRequestToCardState } from "@/components/teachers/detail/teacher-detail.mappers"
import { teacherDetailQueryKeys } from "@/components/teachers/detail/teacher-detail-query-keys"
import { RequestDecisionCard } from "@/components/shared/requests/request-decision-card"

type TeacherDetailLeaveRequestSectionProps = {
  teacherId: string
}

export function TeacherDetailLeaveRequestSection({
  teacherId,
}: TeacherDetailLeaveRequestSectionProps) {
  const queryClient = useQueryClient()
  const t = useTranslations("adminTeachers.detail.leaveRequest")

  const leaveRequestsQuery = useQuery({
    queryFn: () => getTeacherDetailLeaveRequests(teacherId),
    queryKey: teacherDetailQueryKeys.leaveRequests(teacherId),
    staleTime: 60_000,
  })

  const updateLeaveRequestMutation = useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: "approved" | "declined" }) =>
      updateTeacherDetailLeaveRequest(teacherId, requestId, status),
    onError: (error) => {
      sileo.error({
        description: error instanceof Error ? error.message : t("toastUpdateError"),
        title: t("title"),
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teacherDetailQueryKeys.leaveRequests(teacherId),
      })
      sileo.success({
        description: t("toastUpdateSuccess"),
        title: t("title"),
      })
    },
  })

  if (leaveRequestsQuery.isLoading) {
    return <Skeleton className="h-[180px] w-72 rounded-[28px]" />
  }

  if (leaveRequestsQuery.isError || !leaveRequestsQuery.data) {
    return null
  }

  const activeRequest =
    leaveRequestsQuery.data.find((item) => item.status === "pending") ??
    leaveRequestsQuery.data[0] ??
    null
  const cardState = mapLeaveRequestToCardState(activeRequest)
  const canReview = activeRequest?.status === "pending"

  return (
    <RequestDecisionCard
      badgeLabel={cardState.badgeLabel}
      className="w-72"
      description={cardState.description}
      isPrimaryActionDisabled={!canReview || updateLeaveRequestMutation.isPending}
      isPrimaryActionLoading={
        updateLeaveRequestMutation.isPending &&
        updateLeaveRequestMutation.variables?.status === "approved"
      }
      isSecondaryActionDisabled={!canReview || updateLeaveRequestMutation.isPending}
      isSecondaryActionLoading={
        updateLeaveRequestMutation.isPending &&
        updateLeaveRequestMutation.variables?.status === "declined"
      }
      onPrimaryAction={
        canReview && activeRequest
          ? () =>
              updateLeaveRequestMutation.mutate({
                requestId: activeRequest.id,
                status: "approved",
              })
          : undefined
      }
      onSecondaryAction={
        canReview && activeRequest
          ? () =>
              updateLeaveRequestMutation.mutate({
                requestId: activeRequest.id,
                status: "declined",
              })
          : undefined
      }
      primaryActionLabel={canReview ? t("approve") : undefined}
      secondaryActionLabel={canReview ? t("decline") : undefined}
      title={t("title")}
    />
  )
}
