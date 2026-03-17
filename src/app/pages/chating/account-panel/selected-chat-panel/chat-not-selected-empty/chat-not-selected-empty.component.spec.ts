import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNotSelectedEmptyComponent } from './chat-not-selected-empty.component';

describe('ChatNotSelectedEmptyComponent', () => {
  let component: ChatNotSelectedEmptyComponent;
  let fixture: ComponentFixture<ChatNotSelectedEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatNotSelectedEmptyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatNotSelectedEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
