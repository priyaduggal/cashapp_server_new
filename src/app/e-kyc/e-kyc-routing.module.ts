import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EKycPage } from './e-kyc.page';

const routes: Routes = [
  {
    path: '',
    component: EKycPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EKycPageRoutingModule {}
