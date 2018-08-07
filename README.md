# notif-vue

Small utility to manage notifications in vuejs applications.

## Example integration

In you store:

```
import Vue from 'vue'
import Vuex from 'vuex'
import {notificationStore} from './notif-vue'

Vue.use(Vuex)

export default () => {
  return new Vuex.Store({
    modules: {notification: notificationStore},
    actions: {
      async doStuff() {
        try {
          await ...doing stuff
          dispatch('notification/queue', 'Stuff done')
        } catch(error) {
          dispatch('notification/queue', {error, msg: 'Error while doing stuff'})
        }
      }
    }
  })
}
```

In your page (example with [vuetify](https://vuetifyjs.com)):

```
<template>
  <v-app>

    <v-toolbar v-if="!!dataFairConfig" app scroll-off-screen>
      ...
    </v-toolbar>

    <v-content>
      ...
      <v-snackbar v-if="notif" ref="notificationSnackbar" v-model="notif" :color="notif.type" :timeout="0" class="notification" bottom>
        <div>
          <p>{{ notif.msg }}</p>
          <p v-if="notif.errorMsg" class="ml-3">{{ notif.errorMsg }}</p>
        </div>
        <v-btn flat icon @click.native="$store.dispatch('notification/unqueue')"><v-icon>close</v-icon></v-btn>
      </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  computed: {
    ...mapState('notification', ['notif'])
  }
}

</script>
<style lang="less">
body .application {
  .notification .v-snack__content {
    height: auto;
    p {
      margin-bottom: 4px;
      margin-top: 4px;
    }
  }
}
</style>

```
