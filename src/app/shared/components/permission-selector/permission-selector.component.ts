import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { Permission } from 'src/app/core/models/auth/permission';
import { Role } from 'src/app/core/models/auth/role';
import { FormsModule } from '@angular/forms';

interface PermissionGroup {
  category: string;
  permissions: Permission[];
  selectedCount: number;
  totalCount: number;
}

@Component({
  selector: 'app-permission-selector',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    CheckboxModule,
    BadgeModule,
    TagModule,
    FormsModule
  ],
  template: `
    <div class="permission-selector">
      <!-- Role Permissions Info -->
      <div class="mb-4" *ngIf="selectedRole">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-user text-blue-600"></i>
            <h6 class="text-blue-800 font-semibold m-0">Permissões da Função: {{ selectedRole.name }}</h6>
          </div>
          <p class="text-blue-700 text-sm m-0">{{ selectedRole.description }}</p>
          <div class="flex flex-wrap gap-1 mt-2">
            <p-tag
              *ngFor="let permission of selectedRole.permissions.slice(0, 5)"
              [value]="permission.name"
              severity="info"
              class="text-xs">
            </p-tag>
            <p-tag
              *ngIf="selectedRole.permissions.length > 5"
              [value]="'+' + (selectedRole.permissions.length - 5) + ' mais'"
              severity="secondary"
              class="text-xs">
            </p-tag>
          </div>
        </div>
      </div>

      <!-- Additional Permissions Section -->
      <div class="mb-3">
        <h6 class="text-gray-800 font-semibold mb-2">
          <i class="pi pi-plus-circle text-green-600 mr-2"></i>
          Permissões Adicionais
        </h6>
        <p class="text-sm text-gray-600 mb-3">
          Selecione permissões extras além das que já vêm com a função escolhida.
        </p>
      </div>

      <!-- Permission Groups -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div *ngFor="let group of permissionGroups" class="permission-group">
          <p-card>
            <ng-template pTemplate="header">
              <div class="bg-gray-50 p-3 border-bottom-1 surface-border">
                <div class="flex justify-content-between align-items-center">
                  <h6 class="m-0 font-semibold text-gray-800">{{ group.category }}</h6>
                  <p-badge
                    [value]="group.selectedCount + '/' + group.totalCount"
                    [severity]="group.selectedCount > 0 ? 'success' : 'info'">
                  </p-badge>
                </div>
              </div>
            </ng-template>

            <ng-template pTemplate="content">
              <div class="permission-list">
                <div
                  *ngFor="let permission of group.permissions"
                  class="flex align-items-start gap-2 mb-3 p-2 border-round hover:bg-gray-50 transition-colors">
                  <p-checkbox
                    [value]="permission.id"
                    [(ngModel)]="selectedPermissionIds"
                    (onChange)="onPermissionChange()"
                    [disabled]="isPermissionFromRole(permission.id)"
                    class="mt-1">
                  </p-checkbox>
                  <div class="flex-1">
                    <label
                      [class]="'block font-medium text-sm cursor-pointer ' + (isPermissionFromRole(permission.id) ? 'text-gray-400' : 'text-gray-700')"
                      (click)="togglePermission(permission.id)">
                      {{ permission.name }}
                    </label>
                    <p class="text-xs text-gray-500 mt-1 mb-0">{{ permission.description }}</p>
                    <p-tag
                      *ngIf="isPermissionFromRole(permission.id)"
                      value="Da função"
                      severity="info"
                      class="text-xs mt-1">
                    </p-tag>
                  </div>
                </div>
              </div>
            </ng-template>
          </p-card>
        </div>
      </div>

      <!-- Selected Additional Permissions Summary -->
      <div class="mt-4" *ngIf="additionalPermissions.length > 0">
        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-check-circle text-green-600"></i>
            <h6 class="text-green-800 font-semibold m-0">Permissões Adicionais Selecionadas ({{ additionalPermissions.length }})</h6>
          </div>
          <div class="flex flex-wrap gap-1">
            <p-tag
              *ngFor="let permission of additionalPermissions"
              [value]="permission.name"
              severity="success"
              class="text-xs">
            </p-tag>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .permission-selector {
      max-height: 600px;
      overflow-y: auto;
    }

    .permission-group :deep(.p-card) {
      height: 100%;
    }

    .permission-group :deep(.p-card-body) {
      padding: 0;
    }

    .permission-group :deep(.p-card-content) {
      padding: 1rem;
    }

    .permission-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .permission-list::-webkit-scrollbar {
      width: 4px;
    }

    .permission-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .permission-list::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }

    .permission-list::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class PermissionSelectorComponent implements OnInit, OnChanges {
  @Input() permissions: Permission[] = [];
  @Input() selectedRole: Role | null = null;
  @Input() selectedPermissionIds: string[] = [];
  @Output() permissionIdsChange = new EventEmitter<string[]>();

  permissionGroups: PermissionGroup[] = [];
  rolePermissionIds: string[] = [];
  additionalPermissions: Permission[] = [];

  ngOnInit() {
    this.updatePermissionGroups();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['permissions'] || changes['selectedRole'] || changes['selectedPermissionIds']) {
      this.updatePermissionGroups();
    }
  }

  private updatePermissionGroups() {
    // Get role permission IDs
    this.rolePermissionIds = this.selectedRole?.permissions?.map(p => p.id) || [];

    // Group permissions by category (extracted from permission name)
    const groupedPermissions = this.groupPermissionsByCategory(this.permissions);

    // Create permission groups with selection counts
    this.permissionGroups = Object.entries(groupedPermissions).map(([category, permissions]) => {
      const selectedInGroup = permissions.filter(p => this.selectedPermissionIds.includes(p.id));
      return {
        category,
        permissions,
        selectedCount: selectedInGroup.length,
        totalCount: permissions.length
      };
    });

    // Update additional permissions
    this.updateAdditionalPermissions();
  }

  private groupPermissionsByCategory(permissions: Permission[]): { [key: string]: Permission[] } {
    const groups: { [key: string]: Permission[] } = {};

    permissions.forEach(permission => {
      // Extract category from permission name (e.g., "STUDENT_CREATE" -> "Student")
      let category = this.extractCategory(permission.name);

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  }

  private extractCategory(permissionName: string): string {
    // Extract category from permission name patterns
    const patterns = [
      { regex: /^STUDENT_/, category: 'Estudantes' },
      { regex: /^TEACHER_/, category: 'Professores' },
      { regex: /^EMPLOYEE_/, category: 'Funcionários' },
      { regex: /^CENTER_/, category: 'Centros' },
      { regex: /^ROLE_/, category: 'Funções' },
      { regex: /^PERMISSION_/, category: 'Permissões' },
      { regex: /^CLASS_/, category: 'Turmas' },
      { regex: /^LESSON_/, category: 'Aulas' },
      { regex: /^ASSESSMENT_/, category: 'Avaliações' },
      { regex: /^CERTIFICATE_/, category: 'Certificados' },
      { regex: /^MATERIAL_/, category: 'Materiais' },
      { regex: /^FINANCE_/, category: 'Financeiro' },
      { regex: /^REPORT_/, category: 'Relatórios' },
      { regex: /^SYSTEM_/, category: 'Sistema' },
      { regex: /^ADMIN_/, category: 'Administração' }
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(permissionName)) {
        return pattern.category;
      }
    }

    // If no pattern matches, try to extract from first word
    const words = permissionName.split('_');
    if (words.length > 0) {
      return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    }

    return 'Outros';
  }

  private updateAdditionalPermissions() {
    // Get additional permissions (not from role)
    this.additionalPermissions = this.permissions.filter(permission =>
      this.selectedPermissionIds.includes(permission.id) &&
      !this.rolePermissionIds.includes(permission.id)
    );
  }

  isPermissionFromRole(permissionId: string): boolean {
    return this.rolePermissionIds.includes(permissionId);
  }

  togglePermission(permissionId: string) {
    if (this.isPermissionFromRole(permissionId)) {
      return; // Don't allow toggling role permissions
    }

    const index = this.selectedPermissionIds.indexOf(permissionId);
    if (index > -1) {
      this.selectedPermissionIds.splice(index, 1);
    } else {
      this.selectedPermissionIds.push(permissionId);
    }

    this.onPermissionChange();
  }

  onPermissionChange() {
    this.updatePermissionGroups();
    this.permissionIdsChange.emit([...this.selectedPermissionIds]);
  }
}
