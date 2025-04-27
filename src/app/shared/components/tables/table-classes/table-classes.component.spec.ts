import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableClassesComponent } from './table-classes.component';

describe('TableWithFiltersComponent', () => {
  let component: TableClassesComponent;
  let fixture: ComponentFixture<TableClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
