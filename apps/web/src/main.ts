import "./scss/styles.scss";
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <button class="btn btn-primary">Click me</button>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
