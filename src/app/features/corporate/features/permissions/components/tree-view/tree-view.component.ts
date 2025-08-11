import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { Permission } from 'src/app/core/models/auth/permission';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-permission-tree-view',
  templateUrl: './tree-view.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TreeModule,
    ProgressSpinnerModule
  ]
})
export class PermissionTreeViewComponent implements OnChanges {
  @Input() permissions: Permission[] = [];
  @Input() loading: boolean = false;

  treeNodes: TreeNode[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['permissions'] && this.permissions) {
      this.buildTreeNodes();
    }
  }

  private buildTreeNodes(): void {
    // The permissions array now contains only root permissions with their children already properly linked
    // We just need to convert them to TreeNode objects
    this.treeNodes = this.permissions.map(permission => this.createTreeNode(permission));
  }

  private createTreeNode(permission: Permission): TreeNode {
    // Convert children permissions to TreeNode objects recursively
    const children = permission.children && permission.children.length > 0
      ? permission.children.map(child => this.createTreeNode(child))
      : undefined;

    return {
      key: permission.id,
      label: permission.name,
      data: permission,
      children: children,
      expanded: true
    };
  }
}
