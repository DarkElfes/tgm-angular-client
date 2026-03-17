import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingAccountDialogComponent } from './adding-account-dialog.component';

describe('AddingAccountDialogComponent', () => {
  let component: AddingAccountDialogComponent;
  let fixture: ComponentFixture<AddingAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddingAccountDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddingAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
