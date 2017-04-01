/**
 * A helper responsible for creating buttons
 */
class ButtonFactory {
  /**
   * Create a button wrapped in a div tag
   * @param title
   * @param subtitle
   * @param buttonText
   * @param buttonId
   * @returns {Element}
   */
  createButton(title, subtitle, buttonText, buttonId) {
    const col = document.createElement('div')
    col.setAttribute('class', 'col-sm-10')

    const h2Text = document.createTextNode(title)
    const h2 = document.createElement('h2')
    h2.appendChild(h2Text)

    const description = document.createElement('p')
      .appendChild(document.createTextNode(subtitle))

    const p = document.createElement('p')
    const alias = document.createElement('a')
    alias.setAttribute('role', 'button')
    alias.setAttribute('id', buttonId)
    alias.setAttribute('class', 'btn btn-default')
    alias.appendChild(document.createTextNode(buttonText))
    p.appendChild(alias)

    col.appendChild(h2)
    col.appendChild(description)
    col.appendChild(p)

    return col
  }
}