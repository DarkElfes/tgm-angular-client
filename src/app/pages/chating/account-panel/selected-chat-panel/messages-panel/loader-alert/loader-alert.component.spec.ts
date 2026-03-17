import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderAlertComponent } from './loader-alert.component';

describe('LoaderAlertComponent', () => {
  let component: LoaderAlertComponent;
  let fixture: ComponentFixture<LoaderAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
