import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Member } from 'src/app/core/models/mocks/member';

@Injectable({
    providedIn: 'root',
})
export class MemberService {
    private http = inject(HttpClient);


    getMembers() {
        return this.http.get<any>('assets/demo/data/members.json')
            .toPromise()
            .then(res => res.data as Member[])
            .then(data => data);
    }
}
