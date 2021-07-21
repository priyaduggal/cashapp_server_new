import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  /*********DECLARATION********** */

  resetForm: FormGroup;
  isSubmit = false;

  /*********DECLARATION********** */


  constructor(private router: Router, private userService: UserService, private fb: FormBuilder) {
    this.validateResetForm();
  }

  ngOnInit() {
  }


  /************VALIDATE FORM************ */

  validateResetForm() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /************VALIDATE FORM************ */


  /************FORGOT ON SUBMIT FORM************ */



  onSubmit(value: any): void{
    this.isSubmit = true;

    console.log('sending');
        if(this.resetForm.invalid){
          return;
        }
        const data = {
          email: value.email
        };

        this.userService.presentLoading();
        this.userService.postData(data,'forgotpassword').subscribe((result) =>{

          console.log(result);
          this.userService.stopLoading();
          if(result.status === 200){
            this.isSubmit = false;
            this.userService.presentToast(result.msg,'success');
            this.onReset();
          }
          else if(result.status === 400){
            this.userService.presentToast(result.msg,'danger');
          }
          else{
            this.userService.presentToast('Error while sending mail! Please try later','danger');
          }
        },
        err => {
          this.userService.stopLoading();
          this.userService.presentToast('Unable to send request, Please try again later','danger');
        }
        );

  }

  /************FORGOT ON SUBMIT FORM************ */


  /***********RESET MY FORM******* */

   onReset() {
    this.isSubmit = false;
    this.resetForm.reset();
  }

  /*****GET AUTH CONTROLS FOR REGISTER FORM****** */

  get form() {
    return this.resetForm.controls;
  }


}
