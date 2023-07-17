<script>
import QrScanner from "qr-scanner";
import moment from "moment";

export default {
  mounted() {
    this.audio = new Audio("./assets/beep.mp3");
    this.scanner = new QrScanner(
      this.$refs.video,
      result => this.setResult(result),
      {
        onDecodeError: error => {
          this.camQrResult = "";
        },
        highlightScanRegion: false,
        highlightCodeOutline: true
      }
    );
  },
  data() {
    return {
      disableButtons: false,
      camQrResult: "",
      scanner: null,
      audio: null,
      isCheckin: false,
      isCheckout: false,
      showActions: true,
      showCheckinSuccess: false,
      showCheckinTwice: false,
      showOnlyCheckout: false
    };
  },
  methods: {
    checkin(event) {
      // `this` inside methods points to the current active instance
      this.disableButtons = true;
      this.isCheckin = true;
      this.scanner.start();
    },
    checkout(event) {
      // `this` inside methods points to the current active instance
      this.disableButtons = true;
      this.isCheckout = true;
      this.scanner.start();
    },
    entryExists(data) {
      if (this.isCheckin) {
        this.showActions = false;
        this.showCheckinTwice = true;

        console.log("error: already checked in today");
      } else if (this.isCheckout) {
        // set checkout time to now
        console.log("set checkout time to now");
        this.$router.push({ path: "checkout", query: { userId: data._id } });
      }
    },
    entryDoesNotExist(data, result) {
      if (this.isCheckout) {
        // TODO:
        // error checkout without checkin, what to do?
        console.log("error, checkout without checkin");
        this.showActions = false;
        this.showOnlyCheckout = true;
      } else if (this.isCheckin) {
        let data = {
          date: moment().format("MM-DD-YYYY"),
          checkinTime: moment(),
          codeId: result.data
        };
        fetch("https://macherblatt2022-c78d.restdb.io/rest/macherblatt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-apikey": "62115f2e34fd62156585883b"
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
            // insert user feedback here
            console.log(data);
            this.showActions = false;
            this.showCheckinSuccess = true;
          });
      }
    },
    setResult(result) {
      // stop scanning for qr codes
      this.scanner.stop();
      // play bleep
      this.audio.play();
      console.log(result.data);

      fetch(
        'https://macherblatt2022-c78d.restdb.io/rest/macherblatt?q={"codeId":' +
          result.data +
          ',"date": {"$date": "$currentDate"}' +
          "}",
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
          if (data[0]) {
            this.entryExists(data[0]);
          } else {
            this.entryDoesNotExist(data, result);
            // new entry
            console.log("new entry " + result.data);
          }
        });
    },
    reload() {
      this.$router.go("home");
    }
  }
};
</script>

<template>
  <div class="scan-panel">
    <div class="main">
      <div id="video-container" width="10%">
        <video id="qr-video" ref="video"></video>
      </div>
      <span id="cam-qr-result">{{ camQrResult }}</span>
      <div
        class="result-message"
        v-if="showCheckinSuccess || showCheckinTwice || showOnlyCheckout"
      >
        <div v-if="showCheckinSuccess">Check-In erfolgreich, viel Spass</div>
        <div v-if="showCheckinTwice">Bereits eingecheckt</div>
        <div v-if="showOnlyCheckout">noch nicht eingecheckt</div>
        <button @click="reload" class="button button-primary button-small">
          Ok
        </button>
      </div>
    </div>
    <div class="actions" v-if="showActions">
      <div>
        <button
          @click="checkin"
          class="button button-primary"
          :disabled="disableButtons"
        >
          Check-In
        </button>
      </div>
      <div>
        <button
          @click="checkout"
          class="button button-primary"
          :disabled="disableButtons"
        >
          Check-Out
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
  text-align: center;
}
.actions {
  height: 500px;
  align-items: baseline;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  text-align: center;
}

#video-container {
  position: relative;
  padding-top: 50px;
}

#qr-video {
  width: 400px;
  height: 225px;
}
#video-container .scan-region-highlight {
  border-radius: 30px;
  outline: rgba(0, 0, 0, 0.25) solid 50vmax;
}
#video-container .code-outline-highlight {
  stroke: rgba(255, 255, 255, 0.5) !important;
  stroke-width: 15 !important;
  stroke-dasharray: none !important;
}

#cam-qr-result {
  font-size: 32px;
  margin: 30px;
}
.result-message {
  margin: 30px;
}
</style>
