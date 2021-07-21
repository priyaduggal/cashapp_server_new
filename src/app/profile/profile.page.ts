import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userdata: any = '';

  uid = localStorage.getItem('id');

  constructor(private userService: UserService) {
    this.userData();
  }

  ngOnInit() {


  }




  userData() {
    const data = {
      user_id: localStorage.getItem('id'),
    };
    this.userService.presentLoading();
    this.userService.postData(data,"getByUserId").subscribe((result) => {
      console.log(result);
      if(result.status === 200 ){
        this.userService.stopLoading();
        this.userService.presentToast(result.msg, 'success');
        this.userdata = result.data;
      }
      else if(result.status === 401 ){
        this.userService.stopLoading();
        this.userService.presentToast(result.msg, 'danger');
      }
      else if(result.status === 500 ){
        this.userService.stopLoading();
        this.userService.presentToast(result.msg, 'danger');
      }
      else{
        this.userService.stopLoading();
        this.userService.presentToast(result.msg,'danger');
      }

    });
  }


}
