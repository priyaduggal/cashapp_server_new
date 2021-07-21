import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ToastController,LoadingController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { Observable, throwError } from 'rxjs';
import { environment } from  '../../../environments/environment';

const API = environment.apiURL;

@Injectable({
  providedIn: 'root'
})




export class UserService {

  loading: any;

  constructor(private http: HttpClient, public toastController: ToastController, public loadingController: LoadingController) { }

  postData(data,endpoint): Observable<any>{
    const api= `http://3.94.162.191:8000/${endpoint}`;
    // const api= `http://localhost:8000/${endpoint}`;
    // const api= `${API}${endpoint}`;
    return this.http.post(api, data);
  }

  getData(endpoint): Observable<any>{
    const api= `http://3.94.162.191:8000/${endpoint}`;
    return this.http.get(api);
  }

  getCountries(): Observable<any>{
    const api= `http://3.94.162.191:8000/getCountries`;
    return this.http.get(api);
  }

  getStates(data): Observable<any>{
    const api= `http://3.94.162.191:8000/getStates`;
    return this.http.post(api,data);
  }

  getCities(data): Observable<any>{
    const api= `http://3.94.162.191:8000/getCities`;
    return this.http.post(api,data);
  }


  async presentToast(message, color){
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'bottom',
      color,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () =>{
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }



  async presentLoading() {
      this.loading = await this.loadingController.create({
      spinner: 'crescent',
      // duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await this.loading.present();
  }

  async stopLoading(){
    if(this.loading !== undefined){
      await this.loading.dismiss();
    }
    else{
      const self = this;
      setTimeout(() => {
        self.stopLoading();
      },1000);
    }
    }

  encryptData(data, salt) {
    try{
      let enc  = CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();
      enc = enc.split('+').join('xMl3Jk').split('/').join('Por21Ld').split('=').join('Ml32');
      return enc;
    }catch(e){
      return 0;
    }
  }

  decryptData(data, salt){
    try{
      data = data.split('xMl3Jk').join('+').split('Por21Ld').join('/').split('Ml32').join('=');
      const bytes = CryptoJS.AES.decrypt(data, salt);
      if(bytes.toString()){
        const dec = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return dec;
      }
      return data;
    }
    catch(e){
      return 0;
    }
  }


}
