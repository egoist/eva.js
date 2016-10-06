import {mapState, mapMutations} from '../../../src'

export default {
  name: 'counter',
  computed: {
    ...mapState(['count'])
  },
  methods: {
    ...mapMutations(['increment'])
  },
  render(h) {
    return (
      <button on-click={this.increment}>
        {this.count}
      </button>
    )
  }
}
