import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReviewComponent } from './table-review.component';

describe('TableReviewComponent', () => {
  let component: TableReviewComponent;
  let fixture: ComponentFixture<TableReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
