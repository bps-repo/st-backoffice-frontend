import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { Permission } from 'src/app/core/models/auth/permission';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-permission-tree-select',
  templateUrl: './permission-tree-select.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TreeModule,
    ProgressSpinnerModule,
    ButtonModule
  ]
})
export class PermissionTreeSelectComponent implements OnChanges {
  @Input() permissions: Permission[] = [];
  @Input() loading: boolean = false;
  @Input() selectedPermissionIds: string[] = [];

  @Output() permissionSelected = new EventEmitter<string[]>();

  treeNodes: TreeNode[] = [];
  selectedNodes: TreeNode[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['permissions'] && this.permissions) {
      this.buildTreeNodes();
    }

    if (changes['selectedPermissionIds'] && this.selectedPermissionIds) {
      this.updateSelectedNodes();
    }
  }

  private buildTreeNodes(): void {
    // Convert permissions to TreeNode objects
    this.treeNodes = this.permissions.map(permission => this.createTreeNode(permission));
    this.updateSelectedNodes();
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
      expanded: true,
      selectable: true
    };
  }

  private updateSelectedNodes(): void {
    if (!this.treeNodes.length || !this.selectedPermissionIds.length) {
      this.selectedNodes = [];
      return;
    }

    // Find all nodes that match the selected permission IDs
    this.selectedNodes = this.findNodesByIds(this.treeNodes, this.selectedPermissionIds);
  }

  private findNodesByIds(nodes: TreeNode[], ids: string[]): TreeNode[] {
    const result: TreeNode[] = [];

    const searchNodes = (nodeList: TreeNode[]) => {
      for (const node of nodeList) {
        if (ids.includes(node.key as string)) {
          result.push(node);
        }

        if (node.children && node.children.length > 0) {
          searchNodes(node.children);
        }
      }
    };

    searchNodes(nodes);
    return result;
  }

  onNodeSelect(event: any): void {
    // When a node is selected, also select all its children
    if (event.node.children) {
      this.selectAllChildren(event.node, true);
    }

    this.emitSelectedPermissionIds();
  }

  onNodeUnselect(event: any): void {
    // When a node is unselected, also unselect all its children
    if (event.node.children) {
      this.selectAllChildren(event.node, false);
    }

    this.emitSelectedPermissionIds();
  }

  private selectAllChildren(node: TreeNode, selected: boolean): void {
    if (!node.children) {
      return;
    }

    for (const child of node.children) {
      // If selecting, add to selectedNodes if not already there
      if (selected) {
        if (!this.selectedNodes.some(n => n.key === child.key)) {
          this.selectedNodes.push(child);
        }
      }
      // If unselecting, remove from selectedNodes
      else {
        const index = this.selectedNodes.findIndex(n => n.key === child.key);
        if (index !== -1) {
          this.selectedNodes.splice(index, 1);
        }
      }

      // Recursively process child's children
      if (child.children) {
        this.selectAllChildren(child, selected);
      }
    }
  }

  private emitSelectedPermissionIds(): void {
    const selectedIds = this.selectedNodes.map(node => node.key as string);
    this.permissionSelected.emit(selectedIds);
  }

  // Helper method to check if all children of a node are selected
  areAllChildrenSelected(node: TreeNode): boolean {
    if (!node.children || node.children.length === 0) {
      return false;
    }

    return node.children.every(child =>
      this.selectedNodes.some(n => n.key === child.key) &&
      (child.children ? this.areAllChildrenSelected(child) : true)
    );
  }

  // Helper method to check if some but not all children of a node are selected
  areSomeChildrenSelected(node: TreeNode): boolean {
    if (!node.children || node.children.length === 0) {
      return false;
    }

    const hasSelectedChild = node.children.some(child =>
      this.selectedNodes.some(n => n.key === child.key) ||
      (child.children ? this.areSomeChildrenSelected(child) : false)
    );

    return hasSelectedChild && !this.areAllChildrenSelected(node);
  }
}
