# Permission Tree Selector Component

A sophisticated Angular component for selecting permissions in a hierarchical tree structure, designed specifically for employee creation and role management.

## Features

### 🌳 **Hierarchical Tree Structure**
- Displays permissions in parent-child relationships
- Supports unlimited nesting levels
- Visual indicators for category vs individual permissions
- Expand/collapse functionality for better navigation

### 🔒 **Role-Based Permission Management**
- **Role Permissions**: Automatically included permissions from the selected role (non-removable)
- **Additional Permissions**: Extra permissions beyond the role scope (selectable)
- Clear visual distinction between permission types

### 🎯 **Smart Selection Logic**
- Prevents deselection of role-based permissions
- Maintains selection state across tree operations
- Real-time counting of selected permissions
- Automatic updates when role changes

### 📊 **Enhanced User Experience**
- Selection counters with badges
- Progress indicators for categories
- Expand/collapse all functionality
- Responsive design for all screen sizes
- Accessibility-friendly interface

## Usage

### Basic Implementation

```typescript
import { PermissionTreeSelectorComponent } from 'src/app/shared/components/permission-tree-selector/permission-tree-selector.component';

@Component({
  // ... component definition
  imports: [PermissionTreeSelectorComponent]
})
export class YourComponent {
  permissions: Permission[] = []; // Tree-structured permissions
  selectedRole: Role | null = null;
  selectedPermissionIds: string[] = [];

  onPermissionIdsChange(permissionIds: string[]) {
    this.selectedPermissionIds = permissionIds;
    // Handle permission changes
  }
}
```

### Template Usage

```html
<app-permission-tree-selector
  [permissions]="permissions"
  [selectedRole]="selectedRole"
  [selectedPermissionIds]="selectedPermissionIds"
  (permissionIdsChange)="onPermissionIdsChange($event)">
</app-permission-tree-selector>
```

## API Reference

### Inputs

| Property | Type | Description |
|----------|------|-------------|
| `permissions` | `Permission[]` | Array of permissions with hierarchical structure |
| `selectedRole` | `Role \| null` | Currently selected role (determines role permissions) |
| `selectedPermissionIds` | `string[]` | Array of selected permission IDs |

### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `permissionIdsChange` | `EventEmitter<string[]>` | Emitted when permission selection changes |

## Permission Data Structure

The component expects permissions in the following hierarchical format:

```typescript
interface Permission {
  id: string;
  name: string;
  description: string;
  children?: Permission[];
}
```

### Example API Response

```json
{
  "success": true,
  "data": [
    {
      "id": "student-management",
      "name": "STUDENT_MANAGEMENT",
      "description": "Student Management module",
      "children": [
        {
          "id": "student-create",
          "name": "STUDENT_CREATE",
          "description": "Create student",
          "children": []
        },
        {
          "id": "student-read",
          "name": "STUDENT_READ", 
          "description": "Read student details",
          "children": []
        }
      ]
    }
  ]
}
```

## Service Integration

### Permissions Service Update

```typescript
// Add to RolesPermissionsService
getPermissionsTree(): Observable<Permission[]> {
  return this.http.get<ApiResponse<Permission[]>>(`${this.permissionsApiUrl}/tree`).pipe(
    map((response) => response.data)
  );
}
```

### Component Integration

```typescript
loadPermissions(): void {
  this.rolesPermissionsService.getPermissionsTree().subscribe({
    next: (permissions) => {
      this.permissions = permissions;
    },
    error: (error) => {
      console.error('Error loading permissions tree', error);
      // Fallback to flat permissions if needed
    }
  });
}
```

## Visual Design

### Color Coding
- **Blue**: Role permissions (from selected role)
- **Green**: Additional permissions (extra selections)
- **Gray**: All permissions view

### Interactive Elements
- **Checkboxes**: For selecting/deselecting permissions
- **Badges**: Show selection counts
- **Tags**: Indicate permission types
- **Expand/Collapse**: Tree navigation controls

### Responsive Behavior
- Desktop: Full tree with all details
- Tablet: Condensed view with essential information
- Mobile: Stacked layout with simplified interface

## Benefits

### For Administrators
- **Clear Hierarchy**: Understand permission relationships
- **Efficient Selection**: Quick navigation through categories
- **Visual Feedback**: Immediate understanding of selections
- **Error Prevention**: Can't accidentally remove role permissions

### For System Architecture
- **Scalable**: Handles unlimited permission nesting
- **Maintainable**: Clean separation of role vs additional permissions
- **Consistent**: Standardized permission management across the application
- **Future-Proof**: Easily extensible for new permission types

## Integration Examples

### Employee Creation
```typescript
// In employee creation form
onRoleSelected(roleId: string): void {
  this.selectedRole = this.roles.find(role => role.id === roleId);
  // Role permissions are automatically handled by the component
}

onSubmit(): void {
  const employeeData = {
    user: {
      // ... user data
      additionalPermissionIds: this.selectedPermissionIds.filter(
        id => !this.selectedRole?.permissions.some(p => p.id === id)
      )
    },
    role: this.selectedRole.id,
    // ... other data
  };
}
```

### Permission Management
```typescript
// In role management
updateRolePermissions(): void {
  const rolePermissions = this.selectedPermissionIds;
  // Update role with new permissions
}
```

This component provides a professional, user-friendly interface for managing complex permission hierarchies while maintaining clear separation between role-based and additional permissions.
