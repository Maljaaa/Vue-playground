import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCounterStore } from './counter'

describe('useCounterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('초기값은 0이다', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('increment 호출 시 count가 1 증가한다', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })

  it('decrement 호출 시 count가 1 감소한다', () => {
    const store = useCounterStore()
    store.decrement()
    expect(store.count).toBe(-1)
  })

  it('reset 호출 시 count가 0이 된다', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    store.reset()
    expect(store.count).toBe(0)
  })

  it('doubleCount는 count의 2배이다', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.doubleCount).toBe(2)
  })
})
