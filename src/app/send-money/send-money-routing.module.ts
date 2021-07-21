import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendMoneyPage } from './send-money.page';

const routes: Routes = [
  {
    path: '',
    component: SendMoneyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendMoneyPageRoutingModule {}
