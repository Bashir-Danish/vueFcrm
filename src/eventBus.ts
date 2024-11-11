import { reactive } from 'vue'

interface EventBus {
  events: { [key: string]: Function[] }
  emit: (event: string, ...args: any[]) => void
  on: (event: string, callback: Function) => void
  off: (event: string, callback: Function) => void
}

const bus: EventBus = reactive({
  events: {} as { [key: string]: Function[] },
  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((callback: Function) => callback(...args))
    }
  },
  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  },
  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb: Function) => cb !== callback)
    }
  }
})

export default bus