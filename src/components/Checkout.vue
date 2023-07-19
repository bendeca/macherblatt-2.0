<script>
// eslint-disable-next-line  no-unused-vars
import { computed } from "@vue/runtime-core";
// eslint-disable-next-line  no-unused-vars
import { RouterLink, RouterView } from "vue-router";
import moment from "moment";

export default {
  data() {
    return {
      showThankYou: false,
      memberStatus: "",
      shops: {
        bike: {
          title: "Velo Werkstatt",
          slug: "velo",
          isActive: false,
          isAvilableAtLocation: false
        },
        wood: {
          title: "Holz Werkstatt",
          slug: "holz",
          isActive: false,
          isAvilableAtLocation: false
        },
        pottery: {
          title: "Ton Werkstatt",
          slug: "ton",
          isActive: false,
          isAvilableAtLocation: false
        },
        digital: {
          title: "Digital Werkstatt",
          slug: "digital",
          isActive: false,
          isAvilableAtLocation: false
        },
        textile: {
          title: "Textil Atelier",
          slug: "textil",
          isActive: false,
          isAvilableAtLocation: false
        },
        screenPrint: {
          title: "Siebdruck Atelier",
          slug: "siebdruck",
          isActive: false,
          isAvilableAtLocation: false
        }
      }
    };
  },
  props: {
    userId: String
  },
  mounted() {
    fetch(
      "https://macherblatt2022-c78d.restdb.io/rest/standort/64b7784817bd7965000187f7",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": "62115f2e34fd62156585883b"
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        for (let i = 0; i < data.availableWorkshops.length; i++) {
          this.shops[data.availableWorkshops[i]].isAvilableAtLocation = true;
        }
      });
  },
  methods: {
    checkout() {
      fetch(
        "https://macherblatt2022-c78d.restdb.io/rest/macherblatt/" +
          this.$route.query.userId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": "62115f2e34fd62156585883b"
          },
          body: JSON.stringify({
            shopsUsed: this.getUsedWorkshops(),
            checkoutTime: moment()
          })
        }
      ).then(data => {
        console.log(data);
        this.showThankYou = true;
        setTimeout(this.goHome(), 2500);
      });
    },
    getUsedWorkshops() {
      let used = [];
      for (const shop in this.shops) {
        if (this.shops[shop].isActive) {
          used.push(shop);
        }
      }
      return used;
    },
    goHome() {
      this.$router.push({ name: "home" });
    }
  },
  computed: {
    shopSelected() {
      return (
        this.shops.bike.isActive ||
        this.shops.wood.isActive ||
        this.shops.pottery.isActive ||
        this.shops.digital.isActive ||
        this.shops.textile.isActive ||
        this.shops.screenPrint.isActive
      );
    },
    memberStatusSelected() {
      return true;
    }
  }
};
</script>

<template>
  <div class="shops" v-if="!showThankYou">
    <h5 class="shops-title">Welche Werkstatt hast du heute genutzt?</h5>
    <div class="shop-panels">
      <div v-for="(shop, key, index) in shops" :key="index">
        <div v-if="shops[key].isAvilableAtLocation">
          <div class="shop-panel" :class="{ active: false }">
            <label
              class="shop-panel-container"
              :class="{ checked: shops[key].isActive }"
            >
              <img
                class="shop-panel-bg"
                :src="'./assets/' + shops[key].slug + '.jpeg'"
              />
              <input type="checkbox" :id="key" v-model="shops[key].isActive" />
            </label>
          </div>
        </div>
      </div>
      <input
        type="radio"
        id="member"
        name="memberStatus"
        value="member"
        v-model="memberStatus"
      />
      <label for="member">Mitglied</label><br />
      <input
        type="radio"
        id="user"
        name="memberStatus"
        value="user"
        v-model="memberStatus"
      />
      <label for="user">Nutzer</label><br />
      <div class="submit">
        <button
          @click="checkout"
          class="button button-primary button-small"
          :disabled="!shopSelected"
        >
          Weiter
        </button>
      </div>
    </div>
  </div>
  <div v-if="showThankYou">Danke, bis zum nächsten Mal!</div>
</template>

<style scoped>
.shops-title {
  font-size: 24px;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 10px;
}

.shop-panels {
  padding: 0 150px;
  padding-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, auto [col-start]);
  grid-template-rows: auto [row-start] auto [row-start] 50px [row-start];
  justify-items: center;
}
.submit {
  grid-column-start: 3;
  grid-row-start: 5;
}

/* The checkbox container */

.shop-panel-bg {
  width: 150px;
  border-radius: 50%;
  opacity: 0.5;
  filter: grayscale(100%);
}

.shop-panel-container {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  padding: 10px;
  border-radius: 50%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.shop-panel-container.checked img {
  opacity: 1;
  filter: grayscale(0%);
}
/* Hide the browser's default checkbox */
.shop-panel-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
</style>
