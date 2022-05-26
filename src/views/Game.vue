<template>
  <div
    ref="main"
    v-touch="{
      left: () => setDirect('left'),
      right: () => setDirect('right'),
      up: () => setDirect('up'),
      down: () => setDirect('down')
    }"
    class="mcont"
    tabindex="-1"
    @keydown.down="setDirect('down')"
    @keydown.up="setDirect('up')"
    @keydown.right="setDirect('right')"
    @keydown.left="setDirect('left')"
  >
    <v-toolbar dense flat>
      <v-btn v-if="!run" text @click="start">
        Старт
      </v-btn>
      <v-btn v-else text @click="stop">
        Стоп
      </v-btn>
      <v-select
        @change="resize"
        v-model="type"
        :items="types"
        item-text="text"
        item-value="value"
      >

      </v-select>
    </v-toolbar>
    <v-sheet
      v-if="!!fieldModel.length"
      :elevation="0"
      max-height="600px"
      max-width="1000px"
    >
      <div
        v-for="row in ROWS"
        :key="'r-'+row"
        class="d-flex flex-row flex-nowrap flex-fill"
      >
        <div
          v-for="col in COLS"
          :key="'r-'+row +'-col-'+col"
          class="cell"
        >
          <div
            v-if="type == 'check'">
            <v-checkbox
              v-model="fieldModel[row-1][col-1]"
              :color="fieldModel[row-1][col-1] == 'eat' ? 'success' : fieldModel[row-1][col-1] ==
               'head' ? 'warning' : ''"
              dense
              hide-details
              readonly
            ></v-checkbox>
          </div>
          <div
            v-else-if="type =='radio'"
          >
            <v-radio-group
              v-model="fieldModel[row-1][col-1]"
              dense
              hide-details
            >
              <v-radio
                :color="fieldModel[row-1][col-1] == 'eat' ? 'green' : fieldModel[row-1][col-1] ==
               'head' ? 'orange' : ''"
                :value="true"
              ></v-radio>
            </v-radio-group>
          </div>
          <div
            v-else>
            <v-switch
              v-model="fieldModel[row-1][col-1]"
              :color="fieldModel[row-1][col-1] == 'eat' ? 'success' : fieldModel[row-1][col-1] ==
               'head' ? 'warning' : ''"
              dense
              inset
              hide-details
              readonly
            ></v-switch>
          </div>
        </div>
      </div>

    </v-sheet>
  </div>
</template>

<script>
export default {
  name: "Game",
  data: () => ({
    radioSnake: null,
    COLS: 20,
    ROWS: 10,
    snake: [[2, 0], [1, 0], [0, 0]],
    move: [1, 0],
    direct: 'right',
    timer: null,
    type: 'switch',
    speed: 1,
    eatdelay: 1,
    eat: null,
    changed: 0,
    run: false,
    types: [
      {text: 'Тип 1', value: 'check'},
      {text: 'Тип 2', value: 'radio'},
      {text: 'Тип 3', value: 'switch'},
    ]
  }),
  created() {
    this.resize()
  },
  mounted() {
    this.$refs.main.focus()
    this.$refs.main.onblur = () => this.$refs.main.focus()
  },
  computed: {
    fieldModel() {
      let r = this.changed
      let res = []
      for (let y = 0; y < this.ROWS; y++) {
        res.push([])
        for (let x = 0; x < this.COLS; x++) {
          res[res.length - 1].push(this.inSnake(x, y))
        }
      }

      if (this.eat) {
        res[this.eat[1]][this.eat[0]] = 'eat'
      }

      return res
    }
  },
  methods: {
    resize() {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden'
      let h = this.$vuetify.breakpoint.height, w = this.$vuetify.breakpoint.width
      let cellH = 32, cellW = 32
      if (this.type == 'switch') {
        cellH = 28
        cellW = 60
      }

      this.ROWS = parseInt((h - 200) / cellH)
      this.COLS = parseInt((w - 20) / cellW)
    },
    inSnake(x, y) {
      let idx = this.snake.findIndex(p => p[0] == x && p[1] == y)
      return idx == -1 ? false : idx == 0 ? 'head' : true
    },
    start() {
      this.run = true
      if (!this.timer) this.timer = []

      this.newTimer()

      this.newEat()
    },
    stop() {
      this.run = false
      clearInterval(this.timer)
    },
    moveSnake() {
      let snake = this.snake
      for (let i = snake.length - 1; i >= 0; i--) {
        if (i != 0) {
          snake[i] = [...snake[i - 1]]
        } else {
          let x = (snake[i][0] + this.move[0]) % this.COLS
          if (x < 0) x += this.COLS
          let y = (snake[i][1] + this.move[1]) % this.ROWS
          if (y < 0) y += this.ROWS
          snake[i] = [x, y]
        }
      }

      if (this.eat && snake[0][0] == this.eat[0] && snake[0][1] == this.eat[1]) {
        this.eat = null
        snake.push([...this.snake[this.snake.length - 1]])
        this.newEat()
        this.speed++
        this.newTimer()
      }

      this.snake = snake
      this.changed++
    },
    newTimer() {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.moveSnake()
      }, 1000 / (1 + this.speed * 0.2))
    },
    setDirect(direct) {
      switch (direct) {
        case 'down':
          if (direct != 'up') this.move = [0, 1];
          break;
        case 'right':
          if (direct != 'left') this.move = [1, 0];
          break;
        case 'up':
          if (direct != 'down') this.move = [0, -1];
          break;
        case 'left':
          if (direct != 'right') this.move = [-1, 0];
          break;
      }
      this.direct = direct
    },
    newEat() {
      let x, y
      let check = false
      while (!check) {
        x = parseInt(Math.random() * (this.COLS - 1))
        y = parseInt(Math.random() * (this.ROWS - 1))

        if (!this.inSnake(x, y)) check = true
      }

      this.eat = [x, y]
    }
  }
}
</script>

<style lang="scss" scoped>
.mcont {
  &:focus {
    outline: none;
  }
}

.v-input--selection-controls {
  margin-top: 0 !important;
}
</style>