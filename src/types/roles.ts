export enum UserRole {
  ENGENHEIRO = 'ENGENHEIRO',
  MESTRE_OBRAS = 'MESTRE_OBRAS',
  GESTOR = 'GESTOR',
  ADMIN = 'ADMIN'
}

export const USER_ROLE_CONFIG = {
  [UserRole.ENGENHEIRO]: {
    label: 'Engenheiro',
    description: 'Acesso às funcionalidades técnicas e aprovações',
    permissions: ['view_technical', 'approve_services', 'edit_projects']
  },
  [UserRole.MESTRE_OBRAS]: {
    label: 'Mestre de Obras',
    description: 'Gestão diária das atividades em campo',
    permissions: ['view_services', 'update_progress', 'manage_teams']
  },
  [UserRole.GESTOR]: {
    label: 'Gestor',
    description: 'Gestão financeira e administrativa',
    permissions: ['view_all', 'manage_budgets', 'approve_expenses']
  },
  [UserRole.ADMIN]: {
    label: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: ['manage_all']
  }
} 