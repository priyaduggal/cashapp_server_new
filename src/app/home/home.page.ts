import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
	slideOpts:any = {
	  slidesPerView: 1.2,
	  loop: true,
	  centeredSlides: true,
	  spaceBetween: 0,
	}
}
