import { AbstractControl, ValidationErrors } from "@angular/forms";


export class EmailAsyncValidation {
    static isEmailValid(controls: AbstractControl): Promise<ValidationErrors | null> {
        let val = controls.value as string
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (val === 'johndoe@gmail.com') {
                    resolve({ emailExist: 'This Email is already in use.' })
                }
                else {
                    resolve(null)
                }

            }, 1500);
        })
    }
}