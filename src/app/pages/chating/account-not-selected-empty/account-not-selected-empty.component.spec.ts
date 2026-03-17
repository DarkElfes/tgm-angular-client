import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNotSelectedEmptyComponent } from './account-not-selected-empty.component';

describe('AccountNotSelectedEmptyComponent', () => {
  let component: AccountNotSelectedEmptyComponent;
  let fixture: ComponentFixture<AccountNotSelectedEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountNotSelectedEmptyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountNotSelectedEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
