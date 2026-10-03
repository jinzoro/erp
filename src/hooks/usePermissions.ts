export function usePermissions() {
  return {
    permissions: [] as string[],
    hasPermission: () => true,
    hasModuleAccess: () => true,
  }
}
