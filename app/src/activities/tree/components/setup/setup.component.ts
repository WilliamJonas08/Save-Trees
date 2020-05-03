import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  form = this.fb.group({
    type: 'easy'
  })

  counter:number =50

  @Output()
  submitted = new EventEmitter<FormGroup>()

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.submitted.emit(this.form.value)
  }

  upBar(){
    this.counter=this.counter+5
  }
  downBar(){
    this.counter=this.counter-5
  }

}
