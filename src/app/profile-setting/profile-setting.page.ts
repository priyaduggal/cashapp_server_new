import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.page.html',
  styleUrls: ['./profile-setting.page.scss'],
})
export class ProfileSettingPage implements OnInit {

 /*********DECLARATION********** */
 profiletab: string = "Basic";

 isSubmitprofile= false;
 isSubmitpass = false;

 userdata:any = "";

 profileForm: FormGroup;
 passwordForm: FormGroup;


 countries: any = '';
 states: any = '';
 cities: any = '';
 selectedCountry: any = '';
 selectedState: any = '';

 /*********DECLARATION********** */

  constructor(private fb:FormBuilder, private userService: UserService) {
    this.userData();
    this.createPassForm();
    this.createProfileForm();
    this.getCountriesData();
  }

  ngOnInit() {
  }

/************CREATE PROFILE AND PASS FORM************ */

createProfileForm(){
  this.profileForm = this.fb.group({
    firstName : ['', [Validators.required]],
    lastName : ['', [Validators.required]],
    phone: ['', [Validators.required]],
    country : ['',[Validators.required]],
    state : ['',[Validators.required]],
    city : ['',[Validators.required]],
    street : ['',[Validators.required]],
    // address : ['', [Validators.required]]
  },{});
}

createPassForm(){
  this.passwordForm = this.fb.group({
    oldpassword: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8) , Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]],
    confirmPassword : ['',[Validators.required,this.equalto('password')]],
    // address : ['', [Validators.required]]
  },{});
}

/************CREATE PROFILE AND PASS FORM************ */


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
/***********PASSWORD MATCHING********** */




/************ FORM ON SUBMIT************ */

  profileEdit(value: any): void{
    console.log('profile edit form');
    this.isSubmitprofile = true;
    if(this.profileForm.invalid){
      return;
    }
    const data = {
      user_id: localStorage.getItem('id'),
      firstName: value.firstName,
      lastName:  value.lastName,
      phone: value.phone,
      country: value.country,
      state: value.state,
      city: value.city,
      street: value.street
    };

    this.userService.presentLoading();
    this.userService.postData(data,'updateProfile').subscribe((result) =>{
      this.isSubmitprofile = false;
      console.log(result);
      this.userService.stopLoading();

      if(result.status === 200){
        this.userService.presentToast(result.msg,'success');
      }
      else if(result.status === 400){
        this.userService.presentToast(result.msg,'danger');
      }
      else{
        this.userService.presentToast('Error while signing up! Please try later','danger');
      }
    },
    err => {
      this.isSubmitprofile = false;
      this.userService.stopLoading();
      this.userService.presentToast('Unable to send request, Please try again later','danger');
    }
    );


  }



  passwordEdit(value: any): void{
    console.log('password edit form');
    this.isSubmitpass = true;
    if(this.passwordForm.invalid){
      return;
    }
    const data = {
      oldpassword: value.oldpassword,
      password: value.password,
      user_id: localStorage.getItem('id')
    };

    this.userService.presentLoading();
    this.userService.postData(data,'changePassword').subscribe((result) =>{
      this.userService.stopLoading();
      console.log(result);
      if(result.status === 200){
        this.isSubmitpass = false;
        this.userService.presentToast(result.msg,'success');
        this.onReset();
      }
      else if(result.status === 401){
        this.isSubmitpass = false;
        this.userService.presentToast(result.msg,'danger');
        this.onReset();
      }
      else{
        this.isSubmitpass = false;
        this.userService.presentToast('Error found!','danger');
        this.onReset();
      }
    },
    err => {
      this.onReset();
      this.isSubmitpass = false;
      this.userService.stopLoading();
      this.userService.presentToast('Unable to send request, Please try again later','danger');
    }
    );


  }

  /***********RESET MY FORM******* */
  onReset() {
    this.isSubmitpass = false;
    this.passwordForm.reset();
  }


  /*****GET AUTH CONTROLS FOR REGISTER FORM****** */

  get passform() {
    return this.passwordForm.controls;
  }
  get proform() {
    return this.profileForm.controls;
  }

     /*****GET USER DATA****** */



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

   /*****GET COUNTRIES****** */

  getCountriesData(){
    this.userService.getCountries().subscribe((result) =>{
      console.log(result);
      if(result.status === 200 ){
        // this.userService.stopLoading();
        // this.userService.presentToast(result.msg, 'success');
        this.countries = result.data;
      }
      else if(result.status === 401 ){
        // this.userService.stopLoading();
        // this.userService.presentToast(result.msg, 'danger');
      }
      else if(result.status === 500 ){
        // this.userService.stopLoading();
        // this.userService.presentToast(result.msg, 'danger');
      }
      else{
        // this.userService.stopLoading();
        // this.userService.presentToast(result.msg,'danger');
      }
    })
  }

   /*****ON COUNTRY,STATE CHANGE****** */

    onCountryChange(){
      let data = {
        country: this.profileForm.get('country').value
      };
      this.getStatesData(data);

    }
    onStateChange(){
      let data = {
        country: this.profileForm.get('country').value,
        state: this.profileForm.get('state').value
      };
      console.log(data);
      this.getCitiesData(data);
    }
   /*****GET STATES****** */

  getStatesData(post){
    this.userService.presentLoading();
    this.userService.getStates(post).subscribe((result) =>{
      console.log(result);
      if(result.status === 200 ){
        this.userService.stopLoading();
        // this.userService.presentToast(result.msg, 'success');
        this.states = result.data;
      }
      else if(result.status === 401 ){
        this.userService.stopLoading();
        // this.userService.presentToast(result.msg, 'danger');
        // this.states = result.msg;
      }
      else if(result.status === 500 ){
        this.userService.stopLoading();
        // this.userService.presentToast(result.msg, 'danger');
        // this.countries = result.msg;
      }
      else{
        this.userService.stopLoading();
        // this.userService.presentToast(result.msg,'danger');
        // this.countries = result.msg;
      }
    })
  }


  /*****GET CITIES****** */

  getCitiesData(data){
    this.userService.presentLoading();
    this.userService.getCities(data).subscribe((result) =>{
      console.log(result);
      if(result.status === 200 ){
        this.userService.stopLoading();
        // this.userService.presentToast(result.msg, 'success');
        this.cities = result.data;
      }
      else if(result.status === 401 ){
        this.userService.stopLoading();
        // this.userService.presentToast(result.msg, 'danger');
        // this.states = result.msg;
      }
      else if(result.status === 500 ){
        this.userService.stopLoading();
        // this.userService.presentToast(result.msg, 'danger');
        // this.countries = result.msg;
      }
      else{
        this.userService.stopLoading();
        // this.userService.presentToast(result.msg,'danger');
        // this.countries = result.msg;
      }
    })
  }



}
