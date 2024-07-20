import { AbstractControl, ValidationErrors } from "@angular/forms";



export class EmpolyeeIdValidation{
    static isEmpIdvalid(controls:AbstractControl):ValidationErrors| null{
        let val = controls.value as string;
        if(!val){
            return null
        }
        if(val){
            let regExp = /^[A-Z]\d{3}$/;
            let isValid = regExp.test(val);
            if(isValid){
                return null
            }else{
                return {invalidEmpId:'Invalid ID. Please enter a single uppercase letter followed by exactly three digits.'}
            }
        }else{
            return null
        }
    }
}