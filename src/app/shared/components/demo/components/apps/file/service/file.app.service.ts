import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { File } from 'src/app/demo/api/file';
import { Metric } from 'src/app/demo/api/metric';
import { Folder } from 'src/app/demo/api/folder';

@Injectable()
export class FileAppService {
    private http = inject(HttpClient);


    getFiles() {
        return this.http.get<any>('assets/demo/data/file-management.json')
            .toPromise()
            .then(res => res.files as File[])
            .then(data => data);
    }

    getMetrics() {
        return this.http.get<any>('assets/demo/data/file-management.json')
            .toPromise()
            .then(res => res.metrics as Metric[])
            .then(data => data);
    }

    getFoldersSmall() {
        return this.http.get<any>('assets/demo/data/file-management.json')
            .toPromise()
            .then(res => res.folders_small as Folder[])
            .then(data => data);
    }

    getFoldersLarge() {
        return this.http.get<any>('assets/demo/data/file-management.json')
            .toPromise()
            .then(res => res.folders_large as Folder[])
            .then(data => data);
    }

}
