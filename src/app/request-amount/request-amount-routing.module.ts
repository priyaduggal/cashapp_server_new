import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestAmountPage } from './request-amount.page';

const routes: Routes = [
  {
    path: '',
    component: RequestAmountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestAmountPageRoutingModule {}
