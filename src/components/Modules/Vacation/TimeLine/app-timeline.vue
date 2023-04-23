<template>
  <app-timeline-empty v-if="!data || !data.length"/>
  <app-timeline-content :data="data" :year="year" v-else/>
</template>

<script>
import AppTimelineEmpty from "@/components/Modules/Vacation/TimeLine/app-timeline-empty";
import AppTimelineContent from "@/components/Modules/Vacation/TimeLine/app-timeline-content";

export default {
  name: "app-timeline",
  components: {AppTimelineContent, AppTimelineEmpty},
  props: {
    year: {
      type: Number,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  }
}
</script>