<template>
  <div>
    <v-row>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="selectedCattle"
          label="Cattle Data To Be Shown"
          :items="cattleKindList"
          item-text="cattle_name"
          item-value="cattle_name"
          outlined=""
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="selectedProduct"
          label="Product Data To Be Shown"
          :items="productList"
          item-text="name"
          item-value="name"
          outlined=""
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="chartTheme"
          label="Chart Theme"
          :items="chartThemeList"
          outlined=""
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="ma-2 card--widget">
          <v-responsive :height="450" :aspect-ratio="16 / 9">
            <no-ssr>
              <v-chart
                :theme="chartTheme"
                :options="lineConfig(harvestData)"
                autoresize=""
              />
            </no-ssr>
          </v-responsive>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="ma-2 card--widget">
          <v-responsive :height="450" :aspect-ratio="16 / 9">
            <no-ssr>
              <v-chart
                :theme="chartTheme"
                :options="pieConfig(harvestData)"
                autoresize=""
              />
            </no-ssr>
          </v-responsive>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="ma-2 card--widget">
          <v-responsive :height="450" :aspect-ratio="16 / 9">
            <no-ssr>
              <v-chart
                :theme="chartTheme"
                :options="scaleAreaConfig(harvestData)"
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
      harvestData: [],
      cattleKindList: [],
      productList: [],
      selectedCattle: '',
      selectedProduct: '',
      chartTheme: 'walden',
      chartThemeList: [
        'chalk',
        'shine',
        'dark',
        'purple-passion',
        'walden',
        'westeros'
      ]
    }
  },
  computed: {
    lineConfig() {
      return harvestData => ({
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
          data: harvestData.map(data => this.formatDate(data.income_date)),
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
            data: harvestData.map(data => data.income_amount),
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
      return harvestData => ({
        legend: {
          data: 'test',
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
          data: harvestData.map(data => this.formatDate(data.income_date)),
          silent: false,
          splitLine: {
            show: false
          }
        },
        yAxis: {},
        series: [
          {
            name: `${this.selectedCattle} - ${this.selectedProduct}`,
            type: 'bar',
            data: harvestData.map(data => data.total_amount),
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
    },
    pieConfig() {
      return harvestData => ({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: 'Harvest Data',
            type: 'pie',
            radius: '75%',
            center: ['50%', '50%'],
            data: harvestData.map(data => data.income_amount),
            roseType: 'radius',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
              return Math.random() * 200
            }
          }
        ]
      })
    }
  },
  watch: {
    selectedCattle: {
      handler(value) {
        this.getHarvestData(value, this.selectedProduct)
      },
      immediate: true
    },
    selectedProduct: {
      handler(value) {
        this.getHarvestData(this.selectedCattle, value)
      },
      immediate: true
    }
  },
  created() {
    this.getCattleKind()
    this.getProductGood()
  },
  methods: {
    formatDate(value) {
      const date = new Date(value)
      return date.toLocaleString(['en-US'], {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    },
    async getCattleKind() {
      try {
        const cattles = await this.$http.$get(`cattles`)
        this.cattleKindList = cattles
      } catch (error) {
        console.log(error)
      }
    },
    async getProductGood() {
      try {
        const product = await this.$http.$get(`productiongoods`)
        this.productList = product
      } catch (error) {
        console.log(error)
      }
    },
    async getHarvestData(cattle, product) {
      try {
        const harvests = await this.$http.$get(`harvests`)
        console.log(cattle)
        if (cattle !== '' && product !== '') {
          this.harvestData = harvests.filter(data => {
            return (
              data.cattle_name === cattle && data.production_good === product
            )
          })
        } else {
          return (this.harvestData = harvests)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
