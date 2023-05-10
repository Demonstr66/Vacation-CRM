<template>
  <tl-calendar
      :items="items"
      :year="year"
  >
    <template v-slot:top>
      Hi, Top
    </template>
    <template v-slot:corner>
      Hi, Corner!
    </template>
    <template v-slot:footer>
      Hi, Footer
    </template>
  </tl-calendar>
</template>

<script>


import TlCalendar from "@/components/Modules/Vacation/TimeLine/tl-calendar";

export default {
  name: 'Timeline',
  components: {TlCalendar},
  props: {
    filters: {
      type: Array
    },
    vacations: {},
    year: {
      type: [String, Number]
    },
    exception: {
      type: Array
    }
  },
  computed: {
    items() {
      return this.groupByUser(this.vacations)
    }
  },
  methods: {
    groupByUser(arr) {
      let users = {}
      arr.map(v => {
        if (!users[v.uid]) {
          users[v.uid] = {
            uid: v.uid,
            user: {...this.$store.getters['users/getUserById'](v.uid)},
            events: []
          }
          users[v.uid].title = users[v.uid].user.displayName
        }

        users[v.uid].events.push({...v})
      })

      return Object.values(users)
    }
  }
}
</script>