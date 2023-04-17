<template>
  <app-block-with-right-navbar>
    <template v-slot:main>
      <app-base-sheet>
        <v-data-table
            :items="Object.values(users)"
            :headers="$options.headers"
        >
          <template v-slot:item.vacationDays="{item}">
            <v-text-field type="number" v-model.number="days">
              <template v-slot:prepend-inner>
                <v-btn>123</v-btn>
              </template>
              <template v-slot:append>
                <v-btn>123</v-btn>
              </template>
            </v-text-field>
          </template>
        </v-data-table>
      </app-base-sheet>
    </template>
    <template v-slot:navbar>

    </template>
  </app-block-with-right-navbar>
</template>

<script>
import AppBaseSheet from "@/layouts/AppBaseSheet";
import AppBlockWithRightNavbar from "@/components/AppBlockWithRightNavbar";
import Template from "@/components/Account/pages/vacations/template";
import {users} from "@/mixins/ComputedData";
import vacationStats from "@/plugins/TableHeaders/VacationStats";

export default {
  name: "VacationStatistic",
  components: {Template, AppBlockWithRightNavbar, AppBaseSheet},
  headers: vacationStats,
  mixins: [users],
  data() {
    return {
      days: 0
    }
  }
}
</script>

<style scoped>

</style>