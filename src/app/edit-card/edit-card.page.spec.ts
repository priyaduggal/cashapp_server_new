import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditCardPage } from './edit-card.page';

describe('EditCardPage', () => {
  let component: EditCardPage;
  let fixture: ComponentFixture<EditCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
