<template>
  <div class="d-flex align-center justify-center">
    <div class="num-input" :class="{disabled}">
      <div class="input-btn" v-if="!disabled">
        <v-btn icon tile small @click="number--" color="warning" :disabled="lock">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </div>
      <div>
        <input
            :class="{
            'error--text': number < 0,
            'grey--text': number === 0,
            'accent--text': number > 0,
            'info--text': number > 7,
            'success--text': number > 14,
          }"
            :disabled="lock"
            type="number"
            v-model="number"
        />
      </div>
      <div class="input-btn" v-if="!disabled">
        <v-btn icon tile small @click="number++" color="success" :disabled="lock">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
    <div
        v-if="!disabled"
        :class="{
        'align-self-start': lock,
        'align-self-end': !lock
      }"
    >
      <v-btn icon tile x-small @click="lock = !lock" color="deep-orange darken-3">
        <v-icon v-if="lock">mdi-lock</v-icon>
        <v-icon v-else color="light-green">mdi-lock-open</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "input-num-with-btns",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 99
    }
  },
  data() {
    return {
      number: 0,
      lock: true
    }
  },
  watch: {
    number(val) {
      if (val > this.max) {
        this.number = this.max
      }
      if (val < this.min) {
        this.number = this.min
      }
    }
  }
}
</script>

<style scoped lang="scss">
.num-input {
  display: flex;
  max-width: fit-content;
  border-radius: 4px;
  border: thin solid grey;

  &.disabled {
    border: none;
    font-size: 1.2em;
  }

  & input {
    outline: none;
    height: 100%;
    line-height: 100%;
    font-size: 1.2em;
    width: 2.1em;
    text-align: center;
    font-weight: bold;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }
  }
}
</style>