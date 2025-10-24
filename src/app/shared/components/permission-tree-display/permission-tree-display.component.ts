import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Permission } from 'src/app/core/models/auth/permission';

interface PermissionTreeNode extends TreeNode {
  id?: string;
  permission?: Permission;
  isRolePermission?: boolean;
  isAdditionalPermission?: boolean;
  childrenCount?: number;
  selectedCount?: number;
}

@Component({
  selector: 'app-permission-tree-display',
  standalone: true,
  imports: [
    CommonModule,
    TreeModule,
    CardModule,
    BadgeModule,
    TagModule,
    ButtonModule
  ],
  template: `
    <div class="permission-tree-display">
      <!-- Role Permissions Section -->
      <div class="mb-4" *ngIf="rolePermissions.length > 0">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div class="flex align-items-center justify-content-between mb-2">
            <h6 class="text-blue-800 font-semibold m-0">
              <i class="pi pi-user text-blue-600 mr-2"></i>
              Permissões da Função
            </h6>
                      <p-badge [value]="rolePermissions.length.toString()" severity="info"></p-badge>
          </div>
          <div class="permission-tree-container">
            <p-tree
              [value]="rolePermissionTree"
              class="w-full role-permissions">
              <ng-template let-node pTemplate="default">
                <div class="tree-node-content flex align-items-center gap-2 w-full">
                  <div class="flex-1">
                    <div class="flex align-items-center gap-2">
                      <span class="font-medium text-blue-700">
                        {{ node.permission?.name || node.label }}
                      </span>
                      <p-badge
                        *ngIf="node.childrenCount"
                        [value]="node.childrenCount"
                        severity="info"
                        class="ml-1">
                      </p-badge>
                      <p-tag
                        value="Função"
                        severity="info"
                        class="text-xs">
                      </p-tag>
                    </div>
                    <div class="text-xs text-blue-600 mt-1" *ngIf="node.permission?.description">
                      {{ node.permission.description }}
                    </div>
                  </div>
                </div>
              </ng-template>
            </p-tree>
          </div>
        </div>
      </div>

      <!-- Additional Permissions Section -->
      <div class="mb-4" *ngIf="additionalPermissions.length > 0">
        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <div class="flex align-items-center justify-content-between mb-2">
            <h6 class="text-green-800 font-semibold m-0">
              <i class="pi pi-plus-circle text-green-600 mr-2"></i>
              Permissões Adicionais
            </h6>
            <p-badge [value]="additionalPermissions.length.toString()" severity="success"></p-badge>
          </div>
          <div class="permission-tree-container">
            <p-tree
              [value]="additionalPermissionTree"
              class="w-full additional-permissions">
              <ng-template let-node pTemplate="default">
                <div class="tree-node-content flex align-items-center gap-2 w-full">
                  <div class="flex-1">
                    <div class="flex align-items-center gap-2">
                      <span class="font-medium text-green-700">
                        {{ node.permission?.name || node.label }}
                      </span>
                      <p-badge
                        *ngIf="node.childrenCount"
                        [value]="node.childrenCount"
                        severity="success"
                        class="ml-1">
                      </p-badge>
                      <p-tag
                        value="Adicional"
                        severity="success"
                        class="text-xs">
                      </p-tag>
                    </div>
                    <div class="text-xs text-green-600 mt-1" *ngIf="node.permission?.description">
                      {{ node.permission.description }}
                    </div>
                  </div>
                </div>
              </ng-template>
            </p-tree>
          </div>
        </div>
      </div>

      <!-- All Permissions Section -->
      <div class="mb-4" *ngIf="allPermissions.length > 0">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div class="flex align-items-center justify-content-between mb-2">
            <h6 class="text-gray-800 font-semibold m-0">
              <i class="pi pi-list text-gray-600 mr-2"></i>
              Todas as Permissões (Organizadas por Categoria)
            </h6>
            <div class="flex gap-2">
              <p-badge [value]="allPermissions.length.toString()" severity="info"></p-badge>
              <button
                pButton
                pRipple
                type="button"
                [label]="isAllExpanded ? 'Recolher' : 'Expandir'"
                [icon]="isAllExpanded ? 'pi pi-minus' : 'pi pi-plus'"
                class="p-button-sm p-button-outlined p-button-secondary"
                (click)="toggleExpandAll()">
              </button>
            </div>
          </div>
          <div class="permission-tree-container">
            <p-tree
              [value]="allPermissionTree"
              class="w-full all-permissions">
              <ng-template let-node pTemplate="default">
                <div class="tree-node-content flex align-items-center gap-2 w-full">
                  <div class="flex-1">
                    <div class="flex align-items-center gap-2">
                      <span [class]="getNodeLabelClass(node)">
                        {{ node.permission?.name || node.label }}
                      </span>
                      <p-badge
                        *ngIf="node.childrenCount"
                        [value]="node.childrenCount.toString()"
                        severity="info"
                        class="ml-1">
                      </p-badge>
                      <p-tag
                        *ngIf="node.isRolePermission"
                        value="Função"
                        severity="info"
                        class="text-xs">
                      </p-tag>
                      <p-tag
                        *ngIf="node.isAdditionalPermission"
                        value="Adicional"
                        severity="success"
                        class="text-xs">
                      </p-tag>
                    </div>
                    <div class="text-xs text-gray-500 mt-1" *ngIf="node.permission?.description">
                      {{ node.permission.description }}
                    </div>
                  </div>
                </div>
              </ng-template>
            </p-tree>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="mt-3 p-3 bg-gray-50 border-round">
        <div class="text-sm text-gray-600">
          <strong>Resumo:</strong>
          {{ getTotalPermissionCount() }} permissões totais
          ({{ rolePermissions.length }} da função + {{ additionalPermissions.length }} adicionais)
        </div>
      </div>
    </div>
  `,
  styles: [`
    .permission-tree-display {
      max-height: 800px;
      overflow-y: auto;
    }

    .permission-tree-container {
      background: white;
      border-radius: 6px;
      padding: 1rem;
    }

    .tree-node-content {
      padding: 0.25rem 0;
    }

    :deep(.p-tree .p-tree-container .p-treenode .p-treenode-content) {
      padding: 0.5rem;
      border-radius: 6px;
      margin-bottom: 2px;
    }

    :deep(.role-permissions .p-tree-container .p-treenode .p-treenode-content) {
      background-color: #eff6ff;
      border-left: 3px solid #3b82f6;
    }

    :deep(.additional-permissions .p-tree-container .p-treenode .p-treenode-content) {
      background-color: #f0fdf4;
      border-left: 3px solid #10b981;
    }

    :deep(.all-permissions .p-tree-container .p-treenode .p-treenode-content) {
      background-color: #f9fafb;
      border-left: 3px solid #6b7280;
    }

    :deep(.p-tree .p-tree-container .p-treenode .p-treenode-content:hover) {
      background-color: #f8fafc;
    }

    :deep(.p-tree .p-tree-container .p-treenode-children) {
      padding-left: 1.5rem;
    }

    .permission-tree-display::-webkit-scrollbar {
      width: 6px;
    }

    .permission-tree-display::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 6px;
    }

    .permission-tree-display::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 6px;
    }

    .permission-tree-display::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class PermissionTreeDisplayComponent implements OnInit, OnChanges {
  @Input() rolePermissions: Permission[] = [];
  @Input() additionalPermissions: Permission[] = [];
  @Input() allPermissions: Permission[] = [];

  rolePermissionTree: PermissionTreeNode[] = [];
  additionalPermissionTree: PermissionTreeNode[] = [];
  allPermissionTree: PermissionTreeNode[] = [];
  isAllExpanded = false;

  ngOnInit() {
    this.updateTrees();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rolePermissions'] || changes['additionalPermissions'] || changes['allPermissions']) {
      this.updateTrees();
    }
  }

  private updateTrees() {
    this.rolePermissionTree = this.buildTreeFromPermissions(this.rolePermissions, 'role');
    this.additionalPermissionTree = this.buildTreeFromPermissions(this.additionalPermissions, 'additional');
    this.allPermissionTree = this.buildTreeFromPermissions(this.allPermissions, 'all');
  }

  private buildTreeFromPermissions(permissions: Permission[], type: 'role' | 'additional' | 'all'): PermissionTreeNode[] {
    return permissions.map(permission => this.createTreeNode(permission, type));
  }

  private createTreeNode(permission: Permission, type: 'role' | 'additional' | 'all'): PermissionTreeNode {
    const hasChildren = permission.children && permission.children.length > 0;

    const node: PermissionTreeNode = {
      key: permission.id,
      label: permission.name,
      data: permission,
      permission: permission,
      isRolePermission: type === 'role' || (type === 'all' && this.isPermissionInList(permission.id, this.rolePermissions)),
      isAdditionalPermission: type === 'additional' || (type === 'all' && this.isPermissionInList(permission.id, this.additionalPermissions)),
      expanded: type === 'all' ? this.isAllExpanded : true,
      icon: hasChildren ? 'pi pi-folder' : 'pi pi-file'
    };

    if (hasChildren) {
      node.children = permission.children!.map(child => this.createTreeNode(child, type));
      node.childrenCount = this.countAllChildren(permission);
    }

    return node;
  }

  private countAllChildren(permission: Permission): number {
    let count = 0;
    if (permission.children) {
      permission.children.forEach(child => {
        count += 1 + this.countAllChildren(child);
      });
    }
    return count;
  }

  private isPermissionInList(permissionId: string, permissionList: Permission[]): boolean {
    return this.flattenPermissions(permissionList).some(p => p.id === permissionId);
  }

  private flattenPermissions(permissions: Permission[]): Permission[] {
    const flattened: Permission[] = [];

    const addPermissions = (perms: Permission[]) => {
      perms.forEach(permission => {
        flattened.push(permission);
        if (permission.children && permission.children.length > 0) {
          addPermissions(permission.children);
        }
      });
    };

    addPermissions(permissions);
    return flattened;
  }

  getNodeLabelClass(node: PermissionTreeNode): string {
    let classes = 'font-medium';

    if (node.isRolePermission) {
      classes += ' text-blue-700';
    } else if (node.isAdditionalPermission) {
      classes += ' text-green-700';
    } else {
      classes += ' text-gray-700';
    }

    if (node.children && node.children.length > 0) {
      classes += ' text-base font-semibold';
    } else {
      classes += ' text-sm';
    }

    return classes;
  }

  toggleExpandAll() {
    this.isAllExpanded = !this.isAllExpanded;
    this.expandAllNodes(this.allPermissionTree, this.isAllExpanded);
  }

  private expandAllNodes(nodes: PermissionTreeNode[], expanded: boolean) {
    nodes.forEach(node => {
      node.expanded = expanded;
      if (node.children) {
        this.expandAllNodes(node.children, expanded);
      }
    });
  }

  getTotalPermissionCount(): number {
    return this.allPermissions.length;
  }
}
