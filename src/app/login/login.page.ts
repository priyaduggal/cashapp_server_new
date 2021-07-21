import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  /*********DECLARATION********** */

  isSubmit = false;
  loginForm: FormGroup;

  showPassword = false;
  passwordToggleIcon = 'eye';

  /*********DECLARATION********** */

  constructor(private router: Router, private userService: UserService, private fb: FormBuilder) {
    this.validateForm();
   }

  ngOnInit() {
  }

  /************SHOW HIDE PASSWORD************ */

  togglePassword(): void{
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      this.passwordToggleIcon = 'eye-off';
    }
    else{
      this.passwordToggleIcon = 'eye';
    }

  }

  /************SHOW HIDE PASSWORD************ */

  /************Validate login form************ */

  validateForm(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /************Validate login form************ */

  /***********On submit*********** */

  onLogin(value: any): void{

    this.isSubmit =  true;
    if(this.loginForm.invalid){
      return;
    }
    const data = {
      email: value.email,
      password: value.password
    };
    this.userService.presentLoading();
    this.userService.postData(data,'login').subscribe((result) => {

      console.log(result);
      if(result.status === 200 ){
        this.isSubmit = false;
        this.userService.stopLoading();
        this.onReset();
        this.userService.presentToast(result.msg, 'success');
        localStorage.setItem('id', result.data._id);
        console.log(localStorage.getItem('id'));
        this.router.navigate(['/home']);
      }
      else if(result.status === 401 ){
        this.isSubmit = false;
        this.userService.stopLoading();
        this.onReset();
        this.userService.presentToast(result.msg, 'danger');
      }
      else{
        this.isSubmit = false;
        this.userService.stopLoading();
        this.userService.presentToast(result.msg,'danger');
      }
    });


  }

  /***********On submit*********** */

  /***********RESET MY FORM******* */
  onReset() {
    this.isSubmit = false;
    this.loginForm.reset();
  }

  /*****GET AUTH CONTROLS FOR REGISTER FORM****** */

  get form() {
    return this.loginForm.controls;
  }

}
