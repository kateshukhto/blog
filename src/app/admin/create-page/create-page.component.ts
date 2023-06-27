import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../../environments/interface";

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent {

  form = new FormGroup({
    title:  new FormControl('', Validators.required),
    text:  new FormControl('', Validators.required),
    author: new FormControl('', Validators.required)
  })

  get title() {
    return this.form.controls.title as FormControl
  }

  get author() {
    return this.form.controls.author as FormControl
  }

  get text() {
    return this.form.controls.text as FormControl
  }

  submit() {
    if(this.form.invalid) {
      return
    }

    const post: Post = {
      text: this.form.value.text as string,
      title: this.form.value.title as string,
      author: this.form.value.author as string,
      date: new Date()
    }
  }
}
