<template>
  <div>
    <v-row>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="coinLimit"
          label="Amount Of coin To Be Shown"
          :items="coinLimitList"
          outlined=""
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="coinStart"
          label="Index Of Coin Start To Show"
          :items="coinStartList"
          outlined=""
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="chartTheme"
          label="Index Of Coin Start To Show"
          :items="chartThemeList"
          outlined=""
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="ma-2 card--widget">
          <v-app-bar dense="" flat="" color="blue-grey darken-4" dark="">
            <v-spacer />
            <v-toolbar-title>
              Coin Price Chart
            </v-toolbar-title>
            <v-spacer />
          </v-app-bar>
          <v-responsive :height="450" :aspect-ratio="16 / 9">
            <no-ssr>
              <v-chart
                :theme="chartTheme"
                :options="lineConfig(cryptoData)"
                autoresize=""
              />
            </no-ssr>
          </v-responsive>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="ma-2 card--widget">
          <v-app-bar dense="" flat="" color="blue-grey darken-4" dark="">
            <v-spacer />
            <v-toolbar-title>
              Coin Price Exchange
            </v-toolbar-title>
            <v-spacer />
          </v-app-bar>
          <v-responsive :height="450" :aspect-ratio="16 / 9">
            <no-ssr>
              <v-chart
                :theme="chartTheme"
                :options="scaleAreaConfig(cryptoData)"
                autoresize=""
              />
            </no-ssr>
          </v-responsive>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cryptoData: [],
      chartTheme: 'chalk',
      chartThemeList: [
        'chalk',
        'shine',
        'dark',
        'purple-passion',
        'walden',
        'westeros'
      ],
      coinLimit: 100,
      coinStart: 100,
      coinLimitList: [25, 50, 75, 100, 125, 150, 175, 200],
      coinStartList: [1, 25, 50, 75, 100, 125, 150, 175, 200]
    }
  },
  computed: {
    lineConfig() {
      return cryptoData => ({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {},
        xAxis: {
          nameLocation: 'middle',
          nameGap: 30,
          data: cryptoData.map(data => data.symbol),
          type: 'category',
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          nameLocation: 'middle',
          nameGap: 30
        },
        series: [
          {
            type: 'line',
            data: cryptoData.map(data => data.price_usd),
            markLine: {
              silent: true,
              data: [
                {
                  yAxis: 100
                }
              ]
            }
          }
        ]
      })
    },
    scaleAreaConfig() {
      return cryptoData => ({
        legend: {
          data: ['ch-24h', 'ch-1h', 'ch-7d'],
          align: 'left'
        },
        toolbox: {
          feature: {
            magicType: {
              type: ['stack', 'tiled']
            },
            dataView: {},
            saveAsImage: {
              pixelRatio: 2
            }
          }
        },
        tooltip: {},
        xAxis: {
          data: cryptoData.map(data => data.symbol),
          silent: false,
          splitLine: {
            show: false
          }
        },
        yAxis: {},
        series: [
          {
            name: 'ch-24h',
            type: 'bar',
            data: cryptoData.map(data => data.percent_change_24h),
            animationDelay: function(idx) {
              return idx * 10
            }
          },
          {
            name: 'ch-1h',
            type: 'bar',
            data: cryptoData.map(data => data.percent_change_1h),
            animationDelay: function(idx) {
              return idx * 10
            }
          },
          {
            name: 'ch-7d',
            type: 'bar',
            data: cryptoData.map(data => data.percent_change_7d),
            animationDelay: function(idx) {
              return idx * 10
            }
          }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function(idx) {
          return idx * 5
        }
      })
    }
  },
  watch: {
    coinLimit: {
      handler(value) {
        this.getCryptoData(this.coinStart, value)
      },
      immediate: true
    },
    coinStart: {
      handler(value) {
        this.getCryptoData(value, this.coinLimit)
      },
      immediate: true
    }
  },
  methods: {
    async getCryptoData(start, limit) {
      try {
        const { data } = await this.$http.$get(
          `https://api.coinlore.com/api/tickers/?start=${start}&limit=${limit}`
        )
        this.cryptoData = data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scope="">
.card--widget {
  .v-toolbar__content {
    padding: 0 12px;
    height: 24px !important;
  }
  .v-toolbar__title {
    font-size: 12px;
  }
  .v-card__text {
    padding: 8px !important;
  }
}
</style>
