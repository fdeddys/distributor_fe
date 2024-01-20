import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, FormControl } from '@angular/forms';

@Directive({
selector: '[opAppCommonValidator]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: CommonValidatorDirective, multi: true }
    ]
})

export class CommonValidatorDirective {
    static required(control: FormControl): ValidationErrors | null {
        if (control.value === '' || control.value == null) {
            return { required: true, message: '*Field is required' };
        }
        return null;
    }

    static validUrl(control: FormControl): ValidationErrors | null {
        if (!control.value.startsWith('https') || !control.value.includes('.io')) {
            return { validUrl: true, message: '*Field is not valid Url' };
        }

        return null;
    }

    static validateCcNumber(control: FormControl): ValidationErrors | null {
        if (!(control.value.startsWith('37')
        || control.value.startsWith('4')
        || control.value.startsWith('5'))
        ) {
            // Return error if card is not Amex, Visa or Mastercard
            return { creditCard: 'Your credit card number is not from a supported credit card provider' };
        } else if (control.value.length !== 16) {
            console.log(control.value);
            // Return error if length is not 16 digits
            return { creditCard: 'A credit card number must be 16-digit long' };
        }
        // If no error, return null
        return null;
    }
}
