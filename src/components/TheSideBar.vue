<template>
  <v-navigation-drawer
    v-model="isExpand"
    :mini-variant="!isExpand"
    :permanent="!isMobile"
    app
    clipped
  >
    <v-list dense nav>
      <v-list-item
      to="/"
      link
    >
      <v-list-item-icon>
        <v-icon>
          mdi-home
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        На главную
      </v-list-item-title>
    </v-list-item>
      <v-divider></v-divider>
      <v-list-item
        v-for="(link, idx) in links"
        :key="idx"
        :to="{name: link.path}"
        link
      >
        <v-list-item-icon>
          <v-icon>
            {{ link.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ link.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "SideNavigation",
  props: {
    expand: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    isMobile: false,
    links: [
      {path: 'Schedule', icon: 'mdi-folder', title: 'Графики отпусков'},
      {path: 'Vacations', icon: 'mdi-star', title: 'Мои отпуска'},
      {path: 'Deportment', icon: 'mdi-account-group', title: 'Команда'},
    ]
  }),

  beforeDestroy() {
    if (typeof window === "undefined") return;

    window.removeEventListener("resize", this.onResize, {passive: true});
  },
  mounted() {
    this.onResize();

    window.addEventListener("resize", this.onResize, {passive: true});
  },
  computed: {
    isExpand: {
      get: function () {
        return this.expand;
      },
      set: function (val) {
        if (!val) this.$emit("close");
      },
    },
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 1264;
    },
  },
};
</script>

