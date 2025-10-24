# Permission Selector Component

A user-friendly permission assignment component that replaces the complex tree-based dropdown approach with an intuitive card-based interface.

## Features

✅ **Card-based Layout**: Permissions are organized in easy-to-understand cards grouped by category
✅ **Visual Role Integration**: Shows which permissions come from the selected role
✅ **Smart Categorization**: Automatically groups permissions by feature area (Students, Teachers, etc.)
✅ **Disabled Role Permissions**: Permissions from the selected role are shown but disabled (can't be unchecked)
✅ **Additional Permissions**: Clear distinction between role permissions and additional permissions
✅ **Selection Summary**: Shows selected count and provides visual feedback
✅ **Responsive Design**: Works well on different screen sizes

## Usage

```typescript
<app-permission-selector
  [permissions]="permissions"
  [selectedRole]="selectedRole"
  [selectedPermissionIds]="selectedPermissionIds"
  (permissionIdsChange)="onPermissionIdsChange($event)">
</app-permission-selector>
```

## Inputs

- `permissions: Permission[]` - All available permissions in the system
- `selectedRole: Role | null` - Currently selected role (shows role permissions as disabled)
- `selectedPermissionIds: string[]` - Array of currently selected permission IDs

## Outputs

- `permissionIdsChange: EventEmitter<string[]>` - Emits when permission selection changes

## Permission Categorization

The component automatically categorizes permissions based on naming patterns:

- `STUDENT_*` → Estudantes
- `TEACHER_*` → Professores  
- `EMPLOYEE_*` → Funcionários
- `CENTER_*` → Centros
- `ROLE_*` → Funções
- `CLASS_*` → Turmas
- `LESSON_*` → Aulas
- `ASSESSMENT_*` → Avaliações
- `CERTIFICATE_*` → Certificados
- `MATERIAL_*` → Materiais
- `FINANCE_*` → Financeiro
- `REPORT_*` → Relatórios
- `SYSTEM_*` → Sistema
- `ADMIN_*` → Administração

## Benefits over Tree Component

1. **Clearer Visual Hierarchy**: Cards are easier to scan than nested trees
2. **Better Role Integration**: Clear distinction between role and additional permissions
3. **No Dropdown Complexity**: Everything is visible at once
4. **Mobile Friendly**: Responsive grid layout works on all devices
5. **Better Accessibility**: Larger click targets and clearer labels
6. **Search Friendly**: Easy to visually locate specific permissions

## Styling

The component uses Tailwind CSS classes and PrimeNG components for consistent styling with the rest of the application. It includes:

- Custom scrollbars for permission lists
- Hover effects for better interaction feedback
- Color-coded badges for status indication
- Proper spacing and typography
