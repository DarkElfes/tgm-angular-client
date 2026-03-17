import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedChatPanelComponent } from './selected-chat-panel.component';

describe('SelectedChatPanelComponent', () => {
  let component: SelectedChatPanelComponent;
  let fixture: ComponentFixture<SelectedChatPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedChatPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedChatPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
