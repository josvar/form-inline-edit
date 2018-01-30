import { Form as SpatieForm } from 'form-backend-validation'
const cloneDeep = require('clone-deep')

class Form {
  constructor(data = {}, options = {}) {
    this.editing = false
    this.spatieForm = new SpatieForm({}, options)
    this.form = data
    this.presentation = data
  }

  edit() {
    this.editing = true
  }

  errors() {
    return this.spatieForm.errors
  }

  cancel() {
    this.form = cloneDeep(this.presentation)

    this.editing = false
  }

  async submit({ only, transformers = {} }) {
    // TODO: add support to only option

    let data = Object.keys(this.form).reduce((carry, key) => {
      carry[key] = transformers[key]
        ? transformers[key](this.form[key])
        : this.form[key]

      return carry
    }, {})

    this.spatieForm.populate(data)

    let response = await this.spatieForm[this.method]
    this.presentation = cloneDeep(this.form)
    this.spatieForm.reset()
    this.editing = false

    return response
  }
}

export default Form
