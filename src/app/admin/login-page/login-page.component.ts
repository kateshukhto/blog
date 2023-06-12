import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/interfaces";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{

  submitted = false;
  message: string;
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  })

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if(params['loginAgain']) {
        this.message = 'Необходимо авторизироваться'
      }
    })
  }
  get email() {
    return this.form.controls.email as FormControl
  }

  get password() {
    return this.form.controls.password as FormControl
  }

  submit() {
    if(this.form.invalid) {
      return
    }
    this.submitted = true;
    const user: User = {
      email: this.form.value.email as string,
      password: this.form.value.password as string
    }

    this.auth.login(user).subscribe((res) => {
      this.submitted =  false;
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard'])
    }, () => {
        this.submitted =  false;
      }
    )
  }
}
