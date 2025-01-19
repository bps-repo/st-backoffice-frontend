import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalTableComponent } from './table-with-filters.component';

describe('TableWithFiltersComponent', () => {
  let component: GlobalTableComponent;
  let fixture: ComponentFixture<GlobalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
