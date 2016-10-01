const EVA = require('../dist/eva.common')

describe('it works', () => {
  test('init', () => {
    const app = new EVA()
    expect(app.$store).toBeUndefined()
    expect(app.$router).toBeUndefined()
    expect(app.routes).toEqual([])
  })
})