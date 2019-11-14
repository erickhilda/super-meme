import Vue from 'vue'
import VueEcharts from 'vue-echarts'

import shine from '~/static/theme/shine.json'
import chalk from '~/static/theme/chalk.json'
import dark from '~/static/theme/dark.json'
import purplePassion from '~/static/theme/purple-passion.json'
import walden from '~/static/theme/walden.json'
import westeros from '~/static/theme/westeros.json'

import 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/gauge'

import 'echarts/lib/component/grid'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/visualMap'

import 'echarts/lib/component/title'

VueEcharts.registerTheme('shine', shine)
VueEcharts.registerTheme('chalk', chalk)
VueEcharts.registerTheme('dark', dark)
VueEcharts.registerTheme('purple-passion', purplePassion)
VueEcharts.registerTheme('walden', walden)
VueEcharts.registerTheme('westeros', westeros)

Vue.component('v-chart', VueEcharts)
