import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesPanelComponent } from './messages-panel.component';

describe('AccountMessagePanelComponent', () => {
  let component: MessagesPanelComponent;
  let fixture: ComponentFixture<MessagesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
