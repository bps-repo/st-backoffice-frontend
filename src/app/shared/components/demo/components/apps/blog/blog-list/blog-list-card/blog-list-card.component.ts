import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Blog } from 'src/app/demo/api/blog';

@Component({
    selector: 'app-blog-general-card',
    templateUrl: './blog-list-card.component.html',
})
export class BlogListCardComponent {
    private router = inject(Router);

    @Input() blog!: Blog;

    navigateToDetail(): void {
        this.router.navigateByUrl('/apps/blog/detail');
    }
}
