import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styles as bgsAppStyles } from './bgs-app-styles'

@customElement('bgs-app')
export class BgsApp extends LitElement {

  static styles = bgsAppStyles

  @property({ type: String })
  title = 'Hey there'

  @property({ type: Number })
  counter = 5

  __increment() {
    this.counter += 1
  }

  render() {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `
  }
}
