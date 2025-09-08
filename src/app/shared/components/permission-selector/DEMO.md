# Permission Selector Demo

## Visual Example

Here's how the new permission assignment interface looks and works:

### 1. Role Selection Impact
When a user selects a role (e.g., "Teacher"), the interface shows:

```
┌─────────────────────────────────────────────────────────────┐
│ 👤 Permissões da Função: Teacher                           │
│ Professores têm acesso às funcionalidades de ensino       │
│ [LESSON_CREATE] [CLASS_MANAGE] [STUDENT_VIEW] +2 mais      │
└─────────────────────────────────────────────────────────────┘
```

### 2. Permission Categories
Permissions are organized in cards by category:

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Estudantes  2/5  │ │ Aulas       3/4  │ │ Relatórios  0/3  │
│                  │ │                  │ │                  │
│ ☑ STUDENT_VIEW   │ │ ☑ LESSON_CREATE  │ │ ☐ REPORT_GENERATE│
│   (Da função)    │ │   (Da função)    │ │                  │
│ ☐ STUDENT_CREATE │ │ ☑ LESSON_UPDATE  │ │ ☐ REPORT_EXPORT  │
│ ☐ STUDENT_EDIT   │ │   (Da função)    │ │ ☐ REPORT_DELETE  │
│ ☐ STUDENT_DELETE │ │ ☑ LESSON_DELETE  │ │                  │
│ ☐ STUDENT_EXPORT │ │ ☐ LESSON_EXPORT  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### 3. Role vs Additional Permissions

**Role Permissions (Disabled)**:
- ✅ Automatically selected based on role
- 🔒 Cannot be unchecked (grayed out)
- 🏷️ Tagged as "Da função"

**Additional Permissions (Selectable)**:
- ☐ Can be selected/deselected freely
- ➕ Added on top of role permissions
- 🎯 Only these are sent in `additionalPermissionIds`

### 4. Selection Summary
```
┌─────────────────────────────────────────────────────────────┐
│ ✅ Permissões Adicionais Selecionadas (3)                  │
│ [STUDENT_CREATE] [REPORT_GENERATE] [SYSTEM_CONFIG]         │
└─────────────────────────────────────────────────────────────┘
```

## User Flow

1. **Select Role**: User picks "Teacher" role
   - Interface shows teacher permissions (disabled)
   - All categories update to show current selections

2. **Add Extra Permissions**: User can check additional permissions
   - Only non-role permissions are selectable
   - Visual feedback shows what's additional vs role-based

3. **Submit**: Form sends:
   ```json
   {
     "role": "teacher-role-id",
     "user": {
       "additionalPermissionIds": ["STUDENT_CREATE", "REPORT_GENERATE"]
     }
   }
   ```

## Benefits in Action

### Before (Tree Component)
```
▼ Permissions
  ▼ Students
    ☐ Create Student
    ☐ Edit Student
    ☐ Delete Student
  ▼ Classes  
    ☐ Create Class
    ☐ Manage Class
```
❌ Hard to see what's selected
❌ No role integration
❌ Mobile unfriendly

### After (Card Component)
```
┌─ Estudantes ─ 2/4 ─┐
│ ☑ View (Da função) │
│ ☐ Create           │
│ ☐ Edit             │  
│ ☐ Delete           │
└────────────────────┘
```
✅ Clear visual hierarchy
✅ Role integration
✅ Mobile responsive
✅ Instant feedback
