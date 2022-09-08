<template>
  <div>
    <v-chip
      v-for="(item, id) in items"
      :key="id"
      :small="$vuetify.breakpoint.mdAndDown"
      class="ma-1 v-chip--clickable"
      draggable
      @dragstart="onDragStart(item.id, $event)"
      @dragend="onDragEnd"
      style="max-width: 150px"
      label
    >
      <span class="text-truncate">
        {{ item.title }}
        </span>
    </v-chip>
  </div>
</template>
<script>
export default {
  name: 'AdministrationDragItems',
  props: {
    items: {
      type: Array,
      required: true
    },
    drag: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isDrag: {
      get() {
        return this.drag
      },
      set(val) {
        this.$emit('update:drag', val)
      }
    }
  },
  methods: {
    onDragStart(id, e) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('id', id)
      this.isDrag = true
    },
    onDragEnd() {
      this.isDrag = false
    }
  }
}
</script>