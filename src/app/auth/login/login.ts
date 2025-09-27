import { Component } from '@angular/core';
import { FormComp } from '../../shared/form/form.comp/form.comp';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [FormComp],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  login(data:any){

  }
}
