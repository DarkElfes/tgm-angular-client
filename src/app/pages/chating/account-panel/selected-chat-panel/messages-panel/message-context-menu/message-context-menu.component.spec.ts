import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageContextMenuComponent } from './message-context-menu.component';

describe('MessageContextMenuComponent', () => {
  let component: MessageContextMenuComponent;
  let fixture: ComponentFixture<MessageContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageContextMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
