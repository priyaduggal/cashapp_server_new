import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmountTransferPage } from './amount-transfer.page';

describe('AmountTransferPage', () => {
  let component: AmountTransferPage;
  let fixture: ComponentFixture<AmountTransferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountTransferPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmountTransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
