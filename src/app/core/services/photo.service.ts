import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Image } from 'src/app/core/models/mocks/image';

@Injectable({
	providedIn: 'root',
})
export class PhotoService {
	private http = inject(HttpClient);


	getImages() {
		return this.http.get<any>('assets/demo/data/photos.json')
			.toPromise()
			.then(res => res.data as Image[])
			.then(data => data);
	}
}
