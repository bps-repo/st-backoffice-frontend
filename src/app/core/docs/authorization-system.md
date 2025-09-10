# Authorization System Documentation

This document describes the comprehensive authorization system implemented for the St. Andrews Backoffice Frontend application.

## Overview

The authorization system provides a robust, flexible way to control user access based on permissions. It includes:

- **AuthorizationService**: Core service for permission checking
- **PermissionGuard**: Route guard for protecting routes
- **HasPermissionDirective**: Structural directive for template-based permission checking
- **HasPermissionPipe**: Pipe for permission checking in templates
- **Caching**: Built-in permission caching for performance

## Components

### 1. AuthorizationService

The main service that handles all permission-related operations.

#### Key Methods

```typescript
// Check single permission
hasPermission(permissionName: string, userId?: string): Observable<boolean>

// Check multiple permissions (any)
hasAnyPermission(permissionNames: string[], userId?: string): Observable<boolean>

// Check multiple permissions (all)
hasAllPermissions(permissionNames: string[], userId?: string): Observable<boolean>

// Check module permission
hasModulePermission(moduleName: string, action: string = 'view', userId?: string): Observable<boolean>

// Check module management permission
hasModuleManagePermission(moduleName: string, userId?: string): Observable<boolean>

// Get current user permissions
getCurrentUserPermissions(): Observable<Permission[]>

// Get module-specific permissions
getModulePermissions(moduleName: string, userId?: string): Observable<Permission[]>

// Clear permission cache
clearPermissionCache(userId?: string): void

// Refresh current user permissions
refreshCurrentUserPermissions(): Observable<Permission[]>
```

#### Usage Examples

```typescript
// In a component
constructor(private authorizationService: AuthorizationService) {}

// Check single permission
this.authorizationService.hasPermission('students.view').subscribe(hasPermission => {
  if (hasPermission) {
    // User can view students
  }
});

// Check multiple permissions
this.authorizationService.hasAnyPermission(['students.view', 'students.create']).subscribe(hasAny => {
  if (hasAny) {
    // User has at least one of the permissions
  }
});

// Check all permissions
this.authorizationService.hasAllPermissions(['students.view', 'students.create']).subscribe(hasAll => {
  if (hasAll) {
    // User has all permissions
  }
});

// Check module permission
this.authorizationService.hasModulePermission('students', 'manage').subscribe(hasManage => {
  if (hasManage) {
    // User can manage students
  }
});
```

### 2. PermissionGuard

Route guard that protects routes based on permissions.

#### Route Configuration

```typescript
// Single permission
{
  path: 'students',
  component: StudentsComponent,
  canActivate: [PermissionGuard],
  data: { permission: 'students.view' }
}

// Multiple permissions (any)
{
  path: 'students',
  component: StudentsComponent,
  canActivate: [PermissionGuard],
  data: { 
    permissions: ['students.view', 'students.create'],
    requireAll: false
  }
}

// Multiple permissions (all)
{
  path: 'students',
  component: StudentsComponent,
  canActivate: [PermissionGuard],
  data: { 
    permissions: ['students.view', 'students.create'],
    requireAll: true
  }
}
```

### 3. HasPermissionDirective

Structural directive for conditional rendering based on permissions.

#### Usage Examples

```html
<!-- Single permission -->
<div *hasPermission="'students.view'">
  Content for users with students.view permission
</div>

<!-- Multiple permissions (any) -->
<div *hasPermission="['students.view', 'students.create']">
  Content for users with any of these permissions
</div>

<!-- Multiple permissions (all) -->
<div *hasPermission="['students.view', 'students.create']; requireAll: true">
  Content for users with all permissions
</div>

<!-- Module permission -->
<div *hasPermission="'students'; module: true">
  Content for users with any students module permission
</div>

<!-- Module with specific action -->
<div *hasPermission="'students'; module: true; action: 'manage'">
  Content for users with students.manage permission
</div>
```

### 4. HasPermissionPipe

Pipe for permission checking in templates.

#### Usage Examples

```html
<!-- Single permission -->
<div *ngIf="'students.view' | hasPermission | async">
  Content for users with students.view permission
</div>

<!-- Multiple permissions (any) -->
<div *ngIf="['students.view', 'students.create'] | hasPermission | async">
  Content for users with any of these permissions
</div>

<!-- Multiple permissions (all) -->
<div *ngIf="['students.view', 'students.create'] | hasPermission:true | async">
  Content for users with all permissions
</div>

<!-- Module permission -->
<div *ngIf="'students' | hasPermission:false:'module' | async">
  Content for users with any students module permission
</div>
```

## Permission Structure

The system supports hierarchical permissions with the following structure:

```
module.action
```

Examples:
- `students.view` - View students
- `students.create` - Create students
- `students.update` - Update students
- `students.delete` - Delete students
- `students.manage` - Manage all student operations (includes all above)

### Hierarchical Permission Checking

The system automatically checks for hierarchical permissions:

- If a user has `students.manage`, they automatically have access to `students.view`, `students.create`, etc.
- If a user has `dashboard.*`, they have access to all dashboard permissions

## Caching

The authorization system includes built-in caching to improve performance:

- **Cache Duration**: 5 minutes (configurable)
- **Automatic Refresh**: Cache is refreshed when user permissions change
- **Manual Refresh**: Use `refreshCurrentUserPermissions()` to force refresh
- **Cache Clearing**: Use `clearPermissionCache()` to clear specific or all cached permissions

## Best Practices

### 1. Use Appropriate Methods

```typescript
// ✅ Good: Use specific permission checks
this.authorizationService.hasPermission('students.view')

// ✅ Good: Use module checks for related permissions
this.authorizationService.hasModulePermission('students', 'manage')

// ❌ Avoid: Checking individual permissions when module check is sufficient
this.authorizationService.hasAllPermissions(['students.view', 'students.create', 'students.update', 'students.delete'])
```

### 2. Template Usage

```html
<!-- ✅ Good: Use directive for conditional rendering -->
<div *hasPermission="'students.view'">Content</div>

<!-- ✅ Good: Use pipe with async for dynamic content -->
<div *ngIf="'students.view' | hasPermission | async">Content</div>

<!-- ❌ Avoid: Complex logic in templates -->
<div *ngIf="(userPermissions | async)?.some(p => p.name === 'students.view')">Content</div>
```

### 3. Route Protection

```typescript
// ✅ Good: Use specific permissions
{ path: 'students', data: { permission: 'students.view' } }

// ✅ Good: Use multiple permissions when needed
{ path: 'students', data: { permissions: ['students.view', 'students.create'] } }

// ❌ Avoid: Overly broad permissions
{ path: 'students', data: { permission: 'admin' } }
```

### 4. Error Handling

```typescript
// ✅ Good: Handle permission errors gracefully
this.authorizationService.hasPermission('students.view').pipe(
  catchError(error => {
    console.error('Permission check failed:', error);
    return of(false);
  })
).subscribe(hasPermission => {
  // Handle result
});
```

## Integration with Existing Code

### 1. Update Existing Guards

Replace existing permission checks with the new AuthorizationService:

```typescript
// Before
this.userManagementService.getUserPermissions(userId).pipe(
  map(permissions => permissions.some(p => p.name === requiredPermission))
)

// After
this.authorizationService.hasPermission(requiredPermission)
```

### 2. Update Templates

Replace manual permission checks with directives or pipes:

```html
<!-- Before -->
<div *ngIf="userPermissions?.some(p => p.name === 'students.view')">Content</div>

<!-- After -->
<div *hasPermission="'students.view'">Content</div>
```

### 3. Update Components

Replace manual permission logic with service methods:

```typescript
// Before
ngOnInit() {
  this.userPermissions$.subscribe(permissions => {
    this.canViewStudents = permissions.some(p => p.name === 'students.view');
  });
}

// After
ngOnInit() {
  this.canViewStudents$ = this.authorizationService.hasPermission('students.view');
}
```

## Performance Considerations

1. **Caching**: The system automatically caches permissions for 5 minutes
2. **Observable Reuse**: Use `shareReplay()` for expensive operations
3. **Lazy Loading**: Permissions are loaded only when needed
4. **Memory Management**: Use `takeUntil()` to prevent memory leaks

## Security Considerations

1. **Server-Side Validation**: Always validate permissions on the server side
2. **Token Security**: Ensure JWT tokens are properly secured
3. **Permission Updates**: Clear cache when user permissions change
4. **Error Handling**: Don't expose sensitive information in error messages

## Troubleshooting

### Common Issues

1. **Permissions not loading**: Check if user is authenticated and has valid token
2. **Cache issues**: Clear cache using `clearPermissionCache()`
3. **Directive not working**: Ensure directive is properly imported
4. **Guard not working**: Check route configuration and permission names

### Debug Mode

Enable debug logging by setting:

```typescript
// In your component or service
console.log('User permissions:', await this.authorizationService.getCurrentUserPermissions().toPromise());
```

## Migration Guide

### From Old Permission System

1. **Replace UserManagementService calls** with AuthorizationService methods
2. **Update route guards** to use the new PermissionGuard
3. **Replace template logic** with HasPermissionDirective or HasPermissionPipe
4. **Update component logic** to use Observable-based permission checks

### Example Migration

```typescript
// Before
ngOnInit() {
  this.userManagementService.getUserPermissions(this.userId).subscribe(permissions => {
    this.canViewStudents = permissions.some(p => p.name === 'students.view');
  });
}

// After
ngOnInit() {
  this.canViewStudents$ = this.authorizationService.hasPermission('students.view');
}
```

This authorization system provides a comprehensive, performant, and maintainable solution for managing user permissions in the application.
