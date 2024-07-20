import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomRegex } from '../../const/validationPattern';
import { EmailAsyncValidation } from '../../validation/emailAsync.validation';
import { EmpolyeeIdValidation } from '../../validation/empId.validation';
import { COUNTRIES_META_DATA, Icountry } from '../../const/countriesData';
import { SnackbarService } from '../../service/snackbar.service';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {

  constructor(
    private _snackbarService: SnackbarService
  ) { }

  signUpForm!: FormGroup;
  genderArr: string[] = ['Male', "Female", "Others"];
  countryArr: Icountry[] = COUNTRIES_META_DATA;
  passwordType!: boolean;
  ConfirmPasswordType!: boolean;


  ngOnInit(): void {
    this.createSignUpForm();
    this.isAddressSame();
    this.patchPermanentAddressVal();
    this.confirmPassStateHandler();
    this.matchPasswordVal();
  }


  createSignUpForm() {
    this.signUpForm = new FormGroup({
      fname: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
      lname: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
      username: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.username), Validators.minLength(6), Validators.maxLength(12)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.email)], [EmailAsyncValidation.isEmailValid]),
      empId: new FormControl(null, [Validators.required, EmpolyeeIdValidation.isEmpIdvalid]),
      gender: new FormControl(null, [Validators.required]),
      skills: new FormArray([]),
      currentAddress: new FormGroup(
        {
          country: new FormControl(null, [Validators.required]),
          state: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
          city: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
          zipcode: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyNumber), Validators.maxLength(6), Validators.minLength(6)])
        }
      ),
      permanentAddress: new FormGroup(
        {
          country: new FormControl(null, [Validators.required]),
          state: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
          city: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyText)]),
          zipcode: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.onlyNumber), Validators.maxLength(6), Validators.minLength(6)])
        }
      ),
      isAddressSame: new FormControl({ value: false, disabled: true }),
      password: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.password)]),
      confirmPassword: new FormControl({ value: null, disabled: true }, [Validators.required])
    })
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.getRawValue());
      this.signUpForm.reset();
      Object.keys(this.controls).forEach(key => {
        this.controls[key].setErrors(null)
      });
      Object.keys(this.currentAddControl).forEach(key => {
        this.currentAddControl[key].setErrors(null)
      });
      Object.keys(this.permanentAddControl).forEach(key => {
        this.permanentAddControl[key].setErrors(null)
      });
      (this.signUpForm.get('skills') as FormArray).controls = [];
      this._snackbarService.openSnackbar('Sign Up Successful!!!')
    }


  }

  get controls() {
    return this.signUpForm.controls
  }
  get skillsFormArray() {
    return this.signUpForm.get('skills') as FormArray;
  }
  get currentAddControl() {
    return (this.signUpForm.get('currentAddress') as FormGroup).controls
  }
  get permanentAddControl() {
    return (this.signUpForm.get('permanentAddress') as FormGroup).controls
  }

  onAddSkill(data: HTMLInputElement) {
    let val = data.value;
    if (this.skillsFormArray.length < 5) {
      if (val != '') {
        let newControl = new FormControl(val, [Validators.required]);
        this.skillsFormArray.push(newControl);
      }
      data.value = '';
    }
  }

  onRemove(data: number) {
    this.skillsFormArray.controls.splice(data, 1)
  }

  isAddressSame() {
    this.controls['currentAddress'].valueChanges.subscribe(res => {
      if (this.controls['currentAddress'].valid) {
        this.controls['isAddressSame'].enable();
        this.controls['permanentAddress'].enable();
      } else {
        this.controls['isAddressSame'].disable();
        this.controls['permanentAddress'].disable();
        this.controls['isAddressSame'].patchValue(false);
      }
    })
  }

  patchPermanentAddressVal() {
    this.controls['isAddressSame'].valueChanges.subscribe(res => {
      if (res) {
        this.controls['permanentAddress'].patchValue(this.controls['currentAddress'].value);
        this.controls['permanentAddress'].disable()
      }
      else {
        this.controls['permanentAddress'].reset();
        this.controls['permanentAddress'].enable();
      }
    })
  }

  togglePassVisibility() {
    this.passwordType = !this.passwordType
  }
  toggleConfirmPassVisibility() {
    this.ConfirmPasswordType = !this.ConfirmPasswordType
  }


  confirmPassStateHandler() {
    this.controls['password'].valueChanges.subscribe(res => {
      if (this.controls['password'].valid) {
        this.controls['confirmPassword'].enable();
      }
      else {
        this.controls['confirmPassword'].disable();
      }
    })
  }
  matchPasswordVal() {
    this.controls['confirmPassword'].valueChanges.subscribe(res => {
      if (this.controls['password'].value !== res) {
        this.controls['confirmPassword'].setErrors({ invalid: true });
      } else {
        this.controls['confirmPassword'].setErrors(null);
      }
    })
  }


}
