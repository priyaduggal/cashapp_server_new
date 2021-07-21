import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCardsPageRoutingModule } from './my-cards-routing.module';

import { MyCardsPage } from './my-cards.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCardsPageRoutingModule
  ],
  declarations: [MyCardsPage]
})
export class MyCardsPageModule {}
