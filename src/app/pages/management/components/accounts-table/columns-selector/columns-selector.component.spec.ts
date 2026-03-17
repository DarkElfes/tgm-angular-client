import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsSelectorComponent } from './columns-selector.component';

describe('ColumnsSelectorComponent', () => {
  let component: ColumnsSelectorComponent;
  let fixture: ComponentFixture<ColumnsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnsSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
