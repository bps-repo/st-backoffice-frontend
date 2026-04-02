import {Component} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {TreeTableModule} from "primeng/treetable";

@Component({
    imports: [
        TreeTableModule
    ],
    templateUrl: './treedemo.component.html'
})
export class TreeDemoComponent {

    files1: TreeNode<any> | TreeNode<any>[] | any[] | any;

    files2: TreeNode<any> | TreeNode<any>[] | any[] | any;

    files3: TreeNode<any> | TreeNode<any>[] | any[] | any;

    selectedFiles1: TreeNode<any> | TreeNode<any>[] | any[] | any;

    selectedFiles2: TreeNode<any> | TreeNode<any>[] | any[] | any;

    selectedFiles3: TreeNode | any = {};

    cols: any[] = [];
}
