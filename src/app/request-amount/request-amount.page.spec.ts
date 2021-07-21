import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestAmountPage } from './request-amount.page';

describe('RequestAmountPage', () => {
  let component: RequestAmountPage;
  let fixture: ComponentFixture<RequestAmountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestAmountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
