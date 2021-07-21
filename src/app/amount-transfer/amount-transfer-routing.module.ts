import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmountTransferPage } from './amount-transfer.page';

const routes: Routes = [
  {
    path: '',
    component: AmountTransferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmountTransferPageRoutingModule {}
