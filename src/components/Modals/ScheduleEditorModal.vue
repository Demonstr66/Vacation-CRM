<template>
  <BaseModal
    :show="show"
    :submitDisable="!this.schedule.year"
    :title="title"
    @cancel="onCancel"
    @reset="reset"
    @submit="onSubmit"
  >
    <v-card-text>
      <v-form>
        <v-text-field
          ref="name"
          :placeholder="defaultName"
          v-model="schedule.name"
        ></v-text-field>
        <v-select
          ref="year"
          :rules="[blankCheck]"
          v-model="schedule.year"
          :items="years"
          dense
        ></v-select>
      </v-form>
    </v-card-text>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import {defSchedule} from "@/plugins/schema";
import {inputRules} from "@/mixins/inputRules";
import {dataMethods} from "@/mixins/dataHelper";

export default {
  mixins:[inputRules, dataMethods],
  components: {
    BaseModal,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "График отпусков",
    },
    data: {}
  },
  data: () => ({
    schedule: defSchedule()
  }),
  created() {
    this.initialize()
  },
  computed: {
    defaultName() {
      return `График отпусков на ${this.schedule.year} год`
    },
    years() {
      const d = 10
      const today = new Date()
      const year = today.getFullYear()
      let years = []

      for (let i = -1 * d; i <= d; i++) years.push('' + (year + i))

      return years
    }
  },
  methods: {
    initialize() {
      this.schedule = defSchedule({year: (new Date()).getFullYear()})
    },
    onChange(get) {
      if (!file) return;

      this.isLoading = true;

      excelToArray(file)
        .then(data => parseArrayData(data, this.availableFields, Object.values(this.users)))
        .then((data) => {
          this.fields = Object.values(data.cols)
          return Promise.resolve(data)
        })
        .then(({items: users, cols}) => this.mixParseTeamsInArray(users, cols))
        .then(({users, cols}) => this.mixParsePostsInArray(users, cols))
        .then(({users}) => {
          this.importingUsers = users
          this.isUploadSuccessful = true
        })
        .catch(err => {
          console.error(err)
          this.isUploadError = true
          this.uploadError = err.message
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    reset() {
    },
    onSubmit() {
      if (!this.schedule.name) this.schedule.name = this.defaultName

      this.mixSaveData({
        saveMethod: !!this.schedule.id ? 'schedules/update' : 'schedules/create',
        isNew: !!!this.schedule.id,
        data: this.schedule
      })

      this.closeModal()
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
  },
  watch: {
    show(val) {
      if (!val) {
        this.initialize()
      } else {
        if (this.data && this.data.id) {
          this.schedule = defSchedule(this.data)
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>