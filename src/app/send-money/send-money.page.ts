import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.page.html',
  styleUrls: ['./send-money.page.scss'],
})
export class SendMoneyPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
slideOpts = {
  slidesPerView: 2.3,
  spaceBetween: 20,
  speed: 400,
  loop:true,
  autoplay:true,
}
}
