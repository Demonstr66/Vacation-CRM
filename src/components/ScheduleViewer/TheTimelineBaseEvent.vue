<template>
  <div
    v-ripple
    :class="{
        'event-actually': event.actually,
        'overflow-hidden': root
      }"
    class="event"
    @click="show"
  >
    <v-badge
      v-if="!root"
      :color="currentStatus.color"
      :icon="currentStatus.icon"
      bordered
      class="badge"
      overlap
    >
    </v-badge>

    <div v-if="root" class="event-workload-wrapper">
      <div
        v-for="(day, dayIndex) in event.days"
        :key="'day-'+dayIndex"
        :class="'event-workload--' + (day.total > 4 ? 'max': day.total)"
        :data-count="day.total"
        class="event-workload"
      ></div>
    </div>

    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      offset-y
      transition="slide-y-transition"
    >
      <EventMenu
        v-if="!root"
        :vacation="event"
        @click="(data) => $emit('click', data)"
      />
    </v-menu>
  </div>
</template>

<script>
import EventMenu from "@/components/ScheduleViewer/EventMenu";
import {vacationStatuses} from "@/mixins/ComputedData";

export default {
  name: 'TheTimelineBaseEvent',
  components: {EventMenu},
  mixins: [vacationStatuses],
  props: {
    event: {},
    root: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showMenu: false,
    x: 0,
    y: 0,
  }),
  computed: {
    currentStatus() {
      return this.vacationStatuses[this.event.status]
    }
  },
  methods: {
    show(e) {
      this.showMenu = false
      this.x = e.target.getBoundingClientRect().x + e.target.offsetWidth / 2
      this.y = e.target.getBoundingClientRect().y + e.target.offsetHeight

      this.$nextTick(() => {
        this.showMenu = true
      })
    },
  },
}
</script>
<style lang="scss" scoped>
$day-width: 25px;
.badge {
  float: right;
  z-index: 2;
}

.event {
  position: absolute;
  display: block;
  top: 1px;
  bottom: 2px;
  background-color: rgb(33, 150, 220);
  background: linear-gradient(45deg, #2196f3, #6ebfff);
  border-radius: 3px;


  &:hover {
    box-shadow: 0 0 5px blue;
    cursor: pointer;
  }

  &-actually {
    background-color: #FF4C7EFF;
    background: linear-gradient(45deg, #fd4c7e, #ffa1bc);
  }

  &-workload-wrapper {
    display: flex;
    width: calc(100% + 3px);
    height: 100%;
    position: absolute;
    left: -1px;

    flex-direction: row;
    justify-content: space-around;
    align-items: flex-end;


    &:hover {

      .event-workload {
        &--1 {
          height: 15%;
        }

        &--2 {
          height: 35%;
        }

        &--3 {
          height: 50%;
        }

        &--4 {
          height: 65%;
        }

        &--max {
          height: 80%;
        }
      }
    }
  }

  &-workload {
    display: block;
    width: 100%;
    height: 15%;
    transition: height .17s ease-in-out;
    border: thin solid #848484;

    &--1 {
      background-color: #B2FF59;
    }

    &--2 {
      transition: height .204s ease-in-out;
      background-color: #EEFF41;
    }

    &--3 {
      transition: height .238s ease-in-out;
      background-color: #FFEA00;
    }

    &--4 {
      transition: height .272s ease-in-out;
      background-color: #FFC400;
    }

    &--max {
      transition: height .306s ease-in-out;
      background-color: #F57C00;
    }
  }
}
</style>