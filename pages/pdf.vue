<template>
  <div>
    <v-row>
      <v-col ref="exportContent" cols="12" sm="12" md="12">
        <v-card>
          <v-app-bar color="error" flat="" dark="" class="title">
            {{ paymentData.title }}
          </v-app-bar>
          <v-card-text>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-avatar tile size="80" color="grey">
                  <v-img src="/mcdonalds.jpg" />
                </v-list-item-avatar>
                <v-list-item-title class="title mb-1">
                  {{ paymentData.productsName }}
                </v-list-item-title>
                <v-list-item class="overline">
                  Transaction Code : {{ paymentData.transactionCode }}
                  <v-icon small color="success">mdi-content-copy</v-icon>
                </v-list-item>
              </v-list-item-content>
            </v-list-item>
            <div class="subheader">Source</div>
            <div class="caption">{{ paymentData.source }}</div>
            <v-divider />
            <div class="title">Payment Detail</div>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in payment" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>{{ item.amount }}</td>
                </tr>
              </tbody>
            </v-simple-table>
            <br />
            <v-divider />
            <v-row class="title mx-3">
              <span>Total Amount</span>
              <v-spacer />
              <span>
                <strong> Rp. {{ paymentData.paymentTotal }} </strong>
              </span>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block="" color="success" @click="download">
          Download Report
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import * as JSPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  data() {
    return {
      paymentData: '',
      payment: [
        { name: 'Nominal', amount: 20000 },
        { name: 'Tip', amount: 10000 }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const data = await this.$http.$get('https://api.myjson.com/bins/by3r3')
      console.log(data)
      this.paymentData = data
      this.payment = data.payment
    },
    download() {
      try {
        const pdfName = 'test'
        const doc = new JSPDF({
          orientation: 'portrait'
        })
        const canvasElement = document.createElement('canvas')
        html2canvas(this.$refs.exportContent, { canvas: canvasElement }).then(
          function(canvas) {
            const img = canvas.toDataURL('image/png')
            doc.addImage(img, 'JPEG', 10, 10)
            doc.save(`${pdfName}.pdf`)
          }
        )
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss"></style>
