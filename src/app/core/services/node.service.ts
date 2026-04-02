import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { TreeNode } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class NodeService {
    private http = inject(HttpClient);


    getFilesystem() {
        return this.http
            .get<any>('assets/demo/data/filesystem.json')
            .toPromise()
            .then((res) => res.data as TreeNode[]);
    }
}
