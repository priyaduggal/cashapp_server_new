import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendMoneyPage } from './send-money.page';

describe('SendMoneyPage', () => {
  let component: SendMoneyPage;
  let fixture: ComponentFixture<SendMoneyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMoneyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendMoneyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
