import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankWalletTransfersPage } from './bank-wallet-transfers.page';

describe('BankWalletTransfersPage', () => {
  let component: BankWalletTransfersPage;
  let fixture: ComponentFixture<BankWalletTransfersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankWalletTransfersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankWalletTransfersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
