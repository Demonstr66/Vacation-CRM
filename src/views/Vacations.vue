<template>
    <v-row class="pa-0 ma-0">
<!--      <v-col>-->
<!--        <ul-->
<!--          v-if="!!items.length"-->
<!--          style="list-style-type: none; margin: 0; padding: 0"-->
<!--        >-->
<!--          <li v-for="(item, id) in items" :key="id" class="mb-1">-->
<!--            <v-sheet elevation="1" outlined class="px-1 py-1" rounded="md">-->
<!--              <v-row>-->
<!--                <v-col>-->
<!--                  <span>{{ id + 1 }}. </span> С-->
<!--                  <span>{{ item.interval.start }}</span> по-->
<!--                  <span>{{ item.interval.end }}</span-->
<!--                  >. Дней: <span>{{ item.interval.length }}</span>-->
<!--                </v-col>-->
<!--                <v-col md="1" class="ml-auto text-center"-->
<!--                  ><v-icon :color="item.isApproved ? 'success' : ''"-->
<!--                    >mdi-check-decagram-outline</v-icon-->
<!--                  ></v-col-->
<!--                >-->
<!--              </v-row>-->
<!--            </v-sheet>-->
<!--          </li>-->
<!--        </ul>-->
<!--        <div v-else>-->
<!--          Отпусков пока нет, Вы можете-->
<!--          <a @click.prevent="showModal">добавить новый</a> прямо сейчас!-->
<!--        </div>-->
<!--      </v-col>-->
<!--      <v-col class="text-right">-->
<!--        <v-btn color="success" @click="showModal">-->
<!--          <v-icon>mdi-plus-circle-outline</v-icon>-->
<!--          Добавить отпуск-->
<!--        </v-btn>-->
<!--        <AddVacationModal-->
<!--          :show="isModalVisible"-->
<!--          @cancel="closeModal"-->
<!--          @submit="onSubmitModal"-->
<!--        />-->
<!--      </v-col>-->

      <TheCalendar/>
    </v-row>
</template>




<script>
import AddVacationModal from "../components/Modals/AddVacation.vue";
import {dateDiff} from "../plugins/utils.js";
import TheCalendar from "@/components/TheCalendar";

export default {
  components: {
    TheCalendar,
    AddVacationModal,
  },
  data: () => ({
    items: [],
    isModalVisible: false,
  }),
  methods: {
    onAddVocation() {
      this.showModal();
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    onSubmitModal(dates) {
      this.addItem(dates);
      this.closeModal();
    },
    addItem(dates) {
      const [start, end] = dates;
      const length = dateDiff(...dates);

      const item = {
        interval: { start, end, length },
        isApproved: false,
      };

      let items = localStorage.getItem("items") || [];

      if (items.length) items = JSON.parse(items);

      items.push(item);

      this.items = items;

      localStorage.setItem("items", JSON.stringify(items));
    },
  },
};
</script>