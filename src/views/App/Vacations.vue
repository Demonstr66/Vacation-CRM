<template>
    <the-vacations
      :vacations="myVacations"
      :uid="currentUID"
    ></the-vacations>
</template>

<script>
import {currentUID, myVacations} from "@/mixins/ComputedData";
import TheVacations from "@/components/TheVacations";

export default {
  name: 'Vacations',
  components: {TheVacations},
  mixins: [ myVacations, currentUID]
}
</script>

<style scoped>

</style>