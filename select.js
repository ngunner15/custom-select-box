export default class Select {
  constructor(element) {
    this.element = element
    this.options = getFormattedOptions(element.querySelectorAll('option'))
    this.customElement = document.createElement('div')
    this.labelElement = document.createElement('span')
    this.optionsCustomElement = document.createElement('ul')
    setupCustomElement(this)
    element.style.display = "none"
    element.after(this.customElement)
  }

  get selectedOption() {
    return this.options.find(option => option.selected)
  }

  selectValue(value) {
    const newSelectedOption = this.options.find(option => {
      return option.value === value
    })
    const prevSelectedOption = this.selectedOption
    prevSelectedOption.selected = false
    prevSelectedOption.element.selected = false

    newSelectedOption.selected = true
    newSelectedOption.element.selected = true

    this.labelElement.innerText = newSelectedOption.label
  }
}

function setupCustomElement(select) {
  select.customElement.classList.add('custom-select-container')
  select.customElement.tabIndex = 0

  select.labelElement.classList.add('custom-select-value')
  select.labelElement.innerText = select.selectedOption.label
  select.customElement.append(select.labelElement)

  select.optionsCustomElement.classList.add('custom-select-options')
  // create options as li tags and append them to ul
  select.options.forEach(option => {
    const optionElement = document.createElement('li')
    optionElement.classList.add('custom-select-option')
    optionElement.classList.toggle('selected', option.selected)
    optionElement.innerText = option.label
    optionElement.dataset.value = option.value
    optionElement.addEventListener('click', () => {
      select.optionsCustomElement.querySelector(`[data-value="${select.selectedOption.value}"]`).classList.remove("selected")
      select.selectValue(option.value)
      optionElement.classList.add("selected")
      select.optionsCustomElement.classList.remove('show')
    })
    select.optionsCustomElement.append(optionElement)
  });
  select.customElement.append(select.optionsCustomElement)

  select.labelElement.addEventListener("click", () => {
    select.optionsCustomElement.classList.toggle("show")
  })
  
  // removes options list when click on screen
  select.customElement.addEventListener("blur", () => {
    select.optionsCustomElement.classList.remove("show")
  })

  // keyboard controls
  select.customElement.addEventListener("keydown", e => {
    switch (e.code) {
      case "Space":
      select.optionsCustomElement.classList.toggle("show")
      break
    }
  })
}

function getFormattedOptions(optionElements) {
  // Convert multiple option elements under select tag to an array
  return [...optionElements].map(optionElement => {
    // return multiple option elements under select tag in an object
    return {
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected,
      element: optionElement
    }
  })
}
