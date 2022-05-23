import { MDCRipple } from '@material/ripple'

const buttonElement = document.querySelector('.mdc-button')

const buttonRipple = new MDCRipple(buttonElement)

// buttonElement.setAttribute('style', 'disabled')

import { MDCTextField } from '@material/textfield'

const textFields = document.querySelectorAll('.mdc-text-field')

textFields.forEach((textField) => {
  new MDCTextField(textField)
})
// const textField = new MDCTextField()

// buttonElement.disabled = false
