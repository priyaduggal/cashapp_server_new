import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EKycPage } from './e-kyc.page';

describe('EKycPage', () => {
  let component: EKycPage;
  let fixture: ComponentFixture<EKycPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EKycPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EKycPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
