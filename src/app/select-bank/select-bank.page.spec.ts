import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectBankPage } from './select-bank.page';

describe('SelectBankPage', () => {
  let component: SelectBankPage;
  let fixture: ComponentFixture<SelectBankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBankPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectBankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
