export type AuthWorkspaceKind = "platform" | "school"

export type AuthWorkspaceContent = {
  loginDescription: string
  loginFooter: string
  loginTitle: string
  marketingCardDescription: string
  marketingCardTitle: string
  marketingDescription: string
  marketingTitle: string
  workspaceBadge: string
}

type AuthCopyTranslator = (key: string) => string

export function getAuthWorkspaceContent(
  t: AuthCopyTranslator,
  kind: AuthWorkspaceKind
): AuthWorkspaceContent {
  const scope = kind === "platform" ? "platform" : "school"

  return {
    workspaceBadge: t(`${scope}.badge`),
    loginTitle: t(`${scope}.title`),
    loginDescription: t(`${scope}.description`),
    loginFooter: t(`${scope}.footer`),
    marketingTitle: t(`${scope}.marketingTitle`),
    marketingDescription: t(`${scope}.marketingDescription`),
    marketingCardTitle: t(`${scope}.marketingCardTitle`),
    marketingCardDescription: t(`${scope}.marketingCardDescription`),
  }
}
