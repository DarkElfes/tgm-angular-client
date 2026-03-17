import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUserInfoComponent } from './chat-user-info.component';

describe('ChatUserInfoComponent', () => {
  let component: ChatUserInfoComponent;
  let fixture: ComponentFixture<ChatUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatUserInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
