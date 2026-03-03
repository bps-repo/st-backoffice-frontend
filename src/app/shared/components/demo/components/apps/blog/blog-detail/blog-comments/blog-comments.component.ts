import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-blog-comments',
    templateUrl: './blog-comments.component.html'
})
export class BlogCommentsComponent {

    @Input() comments: [] = [];

    rowCount = 3;

}
