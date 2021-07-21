/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import {  FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  /*********DECLARATION********** */

  signupForm: FormGroup = new FormGroup({});
  isSubmit: boolean ;

  showPassword = false;
  passwordToggleIcon = 'eye';

  showConfirmPassword = false;
  confirmPasswordIcon = 'eye';

  /*********DECLARATION********** */




  constructor(public userService: UserService, private router: Router, public fb: FormBuilder) {
    this.isSubmit = false;
    this.createSignupForm();
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

  toggleConfirmPassword(): void{
    this.showConfirmPassword = !this.showConfirmPassword;
    if(this.showConfirmPassword){
      this.confirmPasswordIcon = 'eye-off';
    }
    else{
      this.confirmPasswordIcon = 'eye';
    }

  }

  /************CREATE A REGISTER FORM************ */

    createSignupForm(){
      this.signupForm = this.fb.group({
        firstName : ['', [Validators.required]],
        lastName : ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8) , Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]],
        confirmPassword : ['',[Validators.required,this.equalto('password')]],
        // address : ['', [Validators.required]]
      },{});
    }

    /***********PASSWORD MATCHING********** */

    equalto(fieldName): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} => {
      const input = control.value;
      const isValid=control.root.value[fieldName]===input;
      if(!isValid){
      return { equalTo: {isValid} };
      }
      else
      {
      return null;
      }
      };
    }

    /************REGISTER FORM ON SUBMIT************ */

      register(value: any): void{
        console.log('register');
        this.isSubmit = true;
        if(this.signupForm.invalid){
          return;
        }
        const data = {
          firstName: value.firstName,
          lastName:  value.lastName,
          email: value.email,
          password: value.password
        };

        this.userService.presentLoading();
        this.userService.postData(data,'addUser').subscribe((result) =>{

          console.log(result);
          this.userService.stopLoading();


          if(result.status === 200){
            this.isSubmit = false;
            this.userService.presentToast(result.msg,'success');
            this.onReset();
            this.router.navigate(['/']);
          }
          else if(result.status === 400){
            this.userService.presentToast(result.msg,'danger');
          }
          else{
            this.userService.presentToast('Error while signing up! Please try later','danger');
          }
        },
        err => {
          this.userService.stopLoading();
          this.userService.presentToast('Unable to send request, Please try again later','danger');
        }
        );


      }

      /***********RESET MY FORM******* */
      onReset() {
        this.isSubmit = false;
        this.signupForm.reset();
      }

      /*****GET AUTH CONTROLS FOR REGISTER FORM****** */

      get form() {
        return this.signupForm.controls;
      }

    }
