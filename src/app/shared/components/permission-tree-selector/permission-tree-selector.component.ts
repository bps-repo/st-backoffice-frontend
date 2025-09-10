import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Permission } from 'src/app/core/models/auth/permission';
import { Role } from 'src/app/core/models/auth/role';

interface PermissionTreeNode extends TreeNode {
  id?: string;
  permission?: Permission;
  isRolePermission?: boolean;
  childrenCount?: number;
  selectedCount?: number;
}

@Component({
  selector: 'app-permission-tree-selector',
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
    <div class="permission-tree-selector">
      <!-- Role Permissions Info -->
      <div class="mb-4" *ngIf="selectedRole">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div class="flex align-items-center gap-2 mb-2">
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
        <div class="flex justify-content-between align-items-center mb-2">
          <h6 class="text-gray-800 font-semibold m-0">
            <i class="pi pi-plus-circle text-green-600 mr-2"></i>
            Permissões Adicionais
          </h6>
          <div class="flex gap-2">
            <button
              pButton
              pRipple
              type="button"
              label="Expandir Todos"
              icon="pi pi-plus"
              class="p-button-sm p-button-outlined"
              (click)="expandAll()">
            </button>
            <button
              pButton
              pRipple
              type="button"
              label="Recolher Todos"
              icon="pi pi-minus"
              class="p-button-sm p-button-outlined"
              (click)="collapseAll()">
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-3">
          Selecione permissões extras além das que já vêm com a função escolhida. As permissões estão organizadas por categorias e subcategorias.
        </p>
      </div>

      <!-- Permission Tree -->
      <div class="permission-tree-container">
        <p-tree
          [value]="permissionTree"
          selectionMode="checkbox"
          [(selection)]="selectedNodes"
          (onNodeSelect)="onNodeSelect($event)"
          (onNodeUnselect)="onNodeUnselect($event)"
          [metaKeySelection]="false"
          class="w-full">
          <ng-template let-node pTemplate="default">
            <div class="tree-node-content flex align-items-center gap-2 w-full">
              <div class="flex-1">
                <div class="flex align-items-center gap-2">
                  <span [class]="getNodeLabelClass(node)">
                    {{ node.permission?.name || node.label }}
                  </span>
                  <p-badge
                    *ngIf="node.childrenCount"
                    [value]="(node.selectedCount || 0) + '/' + node.childrenCount"
                    [severity]="(node.selectedCount || 0) > 0 ? 'success' : 'info'"
                    class="ml-1">
                  </p-badge>
                  <p-tag
                    *ngIf="node.isRolePermission"
                    value="Da função"
                    severity="info"
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

      <!-- Selected Additional Permissions Summary -->
      <div class="mt-4" *ngIf="additionalPermissions.length > 0">
        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <div class="flex align-items-center gap-2 mb-2">
            <i class="pi pi-check-circle text-green-600"></i>
            <h6 class="text-green-800 font-semibold m-0">
              Permissões Adicionais Selecionadas ({{ additionalPermissions.length }})
            </h6>
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

      <!-- Selection Summary -->
      <div class="mt-3 p-3 bg-gray-50 border-round">
        <div class="text-sm text-gray-600">
          <strong>Total de permissões selecionadas:</strong> {{ getTotalSelectedCount() }}
          <span *ngIf="selectedRole"> ({{ rolePermissionIds.length }} da função + {{ additionalPermissions.length }} adicionais)</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .permission-tree-selector {
      max-height: 700px;
      overflow-y: auto;
    }

    .permission-tree-container {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
      background: white;
    }

    .tree-node-content {
      padding: 0.25rem 0;
    }

    :deep(.p-tree .p-tree-container .p-treenode .p-treenode-content) {
      padding: 0.5rem;
      border-radius: 6px;
      margin-bottom: 2px;
    }

    :deep(.p-tree .p-tree-container .p-treenode .p-treenode-content:hover) {
      background-color: #f8fafc;
    }

    :deep(.p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight) {
      background-color: #dbeafe;
      color: #1e40af;
    }

    :deep(.p-tree .p-tree-container .p-treenode .p-treenode-content.p-treenode-selectable:not(.p-highlight):hover) {
      background-color: #f1f5f9;
    }

    :deep(.p-tree .p-tree-container .p-treenode-children) {
      padding-left: 1.5rem;
    }

    :deep(.p-tree .p-checkbox) {
      margin-right: 0.5rem;
    }

    .permission-tree-selector::-webkit-scrollbar {
      width: 6px;
    }

    .permission-tree-selector::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 6px;
    }

    .permission-tree-selector::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 6px;
    }

    .permission-tree-selector::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class PermissionTreeSelectorComponent implements OnInit, OnChanges {
  @Input() permissions: Permission[] = [];
  @Input() selectedRole: Role | null = null;
  @Input() selectedPermissionIds: string[] = [];
  @Output() permissionIdsChange = new EventEmitter<string[]>();

  permissionTree: PermissionTreeNode[] = [];
  selectedNodes: PermissionTreeNode[] = [];
  rolePermissionIds: string[] = [];
  additionalPermissions: Permission[] = [];
  private permissionMap: Map<string, Permission> = new Map();

  ngOnInit() {
    this.updatePermissionTree();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['permissions'] || changes['selectedRole'] || changes['selectedPermissionIds']) {
      this.updatePermissionTree();
    }
  }

  private updatePermissionTree() {
    // Get role permission IDs
    this.rolePermissionIds = this.selectedRole?.permissions?.map(p => p.id) || [];

    // Create permission map for easy lookup
    this.createPermissionMap(this.permissions);

    // Build tree structure
    this.permissionTree = this.buildTreeFromPermissions(this.permissions);

    // Update selection
    this.updateSelection();

    // Update additional permissions
    this.updateAdditionalPermissions();
  }

  private createPermissionMap(permissions: Permission[]) {
    this.permissionMap.clear();

    const addToMap = (perms: Permission[]) => {
      perms.forEach(permission => {
        this.permissionMap.set(permission.id, permission);
        if (permission.children && permission.children.length > 0) {
          addToMap(permission.children);
        }
      });
    };

    addToMap(permissions);
  }

  private buildTreeFromPermissions(permissions: Permission[]): PermissionTreeNode[] {
    return permissions.map(permission => this.createTreeNode(permission));
  }

  private createTreeNode(permission: Permission): PermissionTreeNode {
    const isRolePermission = this.rolePermissionIds.includes(permission.id);
    const hasChildren = permission.children && permission.children.length > 0;

    const node: PermissionTreeNode = {
      key: permission.id,
      label: permission.name,
      data: permission,
      permission: permission,
      isRolePermission: isRolePermission,
      selectable: !isRolePermission, // Role permissions cannot be unselected
      expanded: false,
      styleClass: isRolePermission ? 'role-permission-node' : 'additional-permission-node'
    };

    if (hasChildren) {
      node.children = permission.children!.map(child => this.createTreeNode(child));
      node.childrenCount = this.countAllChildren(permission);
      node.selectedCount = this.countSelectedChildren(permission);
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

  private countSelectedChildren(permission: Permission): number {
    let count = 0;
    if (permission.children) {
      permission.children.forEach(child => {
        if (this.selectedPermissionIds.includes(child.id)) {
          count++;
        }
        count += this.countSelectedChildren(child);
      });
    }
    return count;
  }

  private updateSelection() {
    this.selectedNodes = [];
    this.updateNodeSelection(this.permissionTree);
  }

  private updateNodeSelection(nodes: PermissionTreeNode[]) {
    nodes.forEach(node => {
      if (node.permission && this.selectedPermissionIds.includes(node.permission.id)) {
        this.selectedNodes.push(node);
      }

      if (node.children) {
        this.updateNodeSelection(node.children);
      }

      // Update selection counts
      if (node.childrenCount) {
        node.selectedCount = this.countSelectedChildren(node.permission!);
      }
    });
  }

  private updateAdditionalPermissions() {
    this.additionalPermissions = [];

    // Get all selected permissions that are not from role
    this.selectedPermissionIds.forEach(permissionId => {
      if (!this.rolePermissionIds.includes(permissionId)) {
        const permission = this.permissionMap.get(permissionId);
        if (permission) {
          this.additionalPermissions.push(permission);
        }
      }
    });
  }

  onNodeSelect(event: any) {
    const node = event.node as PermissionTreeNode;
    if (node.permission && !node.isRolePermission) {
      // add this node id
      if (!this.selectedPermissionIds.includes(node.permission.id)) {
        this.selectedPermissionIds.push(node.permission.id);
      }
      // add all non-role descendant ids
      const descendantIds = this.collectDescendantIds(node);
      descendantIds.forEach(id => {
        if (!this.selectedPermissionIds.includes(id)) {
          this.selectedPermissionIds.push(id);
        }
      });
      this.emitChange();
    }
  }

  onNodeUnselect(event: any) {
    const node = event.node as PermissionTreeNode;
    if (node.permission && !node.isRolePermission) {
      // remove this node id
      const index = this.selectedPermissionIds.indexOf(node.permission.id);
      if (index > -1) {
        this.selectedPermissionIds.splice(index, 1);
      }
      // remove all non-role descendant ids
      const descendantIds = this.collectDescendantIds(node);
      this.selectedPermissionIds = this.selectedPermissionIds.filter(id => !descendantIds.includes(id));
      this.emitChange();
    }
  }

  private emitChange() {
    this.updatePermissionTree();
    this.permissionIdsChange.emit([...this.selectedPermissionIds]);
  }

  getNodeLabelClass(node: PermissionTreeNode): string {
    let classes = 'font-medium';

    if (node.isRolePermission) {
      classes += ' text-gray-400';
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

  expandAll() {
    this.expandAllNodes(this.permissionTree, true);
  }

  collapseAll() {
    this.expandAllNodes(this.permissionTree, false);
  }

  private expandAllNodes(nodes: PermissionTreeNode[], expanded: boolean) {
    nodes.forEach(node => {
      node.expanded = expanded;
      if (node.children) {
        this.expandAllNodes(node.children, expanded);
      }
    });
  }

  getTotalSelectedCount(): number {
    return this.selectedPermissionIds.length;
  }

  private collectDescendantIds(node: PermissionTreeNode): string[] {
    const ids: string[] = [];
    const walk = (n: PermissionTreeNode) => {
      if (n.children && n.children.length > 0) {
        n.children.forEach(child => {
          const c = child as PermissionTreeNode;
          if (c.permission && !c.isRolePermission) {
            ids.push(c.permission.id);
          }
          walk(c);
        });
      }
    };
    walk(node);
    return ids;
  }
}
