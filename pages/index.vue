<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <v-card class="ma-2 card--widget">
          <v-app-bar dense="" color="primary" flat="" dark="">
            <v-toolbar-title>Daftar Panen</v-toolbar-title>
            <v-spacer />
            <v-btn color="white" outlined="" @click="onNewTransactiClicked()">
              Transaksi Baru
            </v-btn>
          </v-app-bar>
          <v-data-table
            :headers="headers"
            :items="harvestData"
            :loading="isLoading"
            loading-text="Load data, please wait..."
            :items-per-page="10"
            class="elevation-1"
          >
            <template #item.income_date="{ item }">
              {{ item.income_date | dateFilter }}
            </template>
            <template #item.total_amount="{ item }">
              Rp. {{ item.income_amount / item.total_amount }}
            </template>
            <template #item.income_amount="{ item }">
              Rp. {{ item.income_amount }}
            </template>
          </v-data-table>
        </v-card>
        <v-dialog v-model="transactionDialog" width="600">
          <v-card :loading="isLoading">
            <v-card-title class=" white--text headline primary" primary-title>
              Masukkan Transaksi Baru
            </v-card-title>

            <v-card-text>
              <v-container fluid="">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="cattleKind"
                      v-validate="'required'"
                      :items="cattleKindList"
                      :error-messages="errors.collect('cattleKind')"
                      label="Jenis Ternak"
                      data-vv-name="cattleKind"
                      item-text="cattle_name"
                      required
                      filled=""
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="productData"
                      v-validate="'required'"
                      :items="productList"
                      :error-messages="errors.collect('productData')"
                      label="Jenis Produk"
                      data-vv-name="productData"
                      item-text="name"
                      item-value="name"
                      required
                      filled=""
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="harvestAmount"
                      v-validate="'required|max:10'"
                      :error-messages="errors.collect('harvestAmount')"
                      label="Jumlah Panen"
                      data-vv-name="harvestAmount"
                      required
                      filled=""
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="pricePerPieces"
                      v-validate="'required|max:10'"
                      :error-messages="errors.collect('pricePerPieces')"
                      label="Harga Satuan"
                      data-vv-name="pricePerPieces"
                      required
                      filled=""
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="harvestIncome"
                      v-validate="'required|max:10'"
                      :error-messages="errors.collect('harvestIncome')"
                      label="Total Pendapatan"
                      data-vv-name="harvestIncome"
                      required
                      filled=""
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="harvestDatePickerDialog"
                      :close-on-content-click="false"
                      max-width="290"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="harvestDate"
                          label="Tanggal Panen"
                          readonly
                          filled=""
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="harvestDate"
                        @change="harvestDatePickerDialog = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn
                color="primary"
                :loading="isLoading"
                @click="saveTransaction()"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  filters: {
    dateFilter: value => {
      const date = new Date(value)
      return date.toLocaleString(['en-US'], {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'Nama Ternak',
          align: 'left',
          sortable: false,
          value: 'cattle_name'
        },
        { text: 'Jumlah Terjual', value: 'expe_amount' },
        { text: 'Tanggal Penjualan', value: 'income_date' },
        { text: 'Jenis Produk', value: 'production_good' },
        { text: 'Harga Rata-rata', value: 'total_amount' },
        { text: 'Harga Total', value: 'income_amount' }
      ],
      productList: [],
      productData: null,
      cattleKindList: [],
      harvestData: [],
      cattleKind: null,
      transactionDialog: false,
      harvestDatePickerDialog: false,
      harvestAmount: null,
      pricePerPieces: 0,
      harvestDate: '',
      harvestIncome: '',
      isLoading: false
    }
  },
  computed: {},
  watch: {
    pricePerPieces: {
      handler(value) {
        this.harvestIncome = value * this.harvestAmount
      }
    },
    harvestAmount: {
      handler(value) {
        this.harvestIncome = value * this.pricePerPieces
      }
    }
  },
  created() {
    this.getHarvestData()
    this.getCattleKind()
    this.getProductGood()
  },
  methods: {
    onNewTransactiClicked() {
      this.transactionDialog = !this.transactionDialog
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
    async getHarvestData() {
      try {
        const res = await this.$http.$get(`harvests`)
        this.harvestData = res
      } catch (error) {
        console.log(error)
      }
    },
    async saveTransaction() {
      try {
        this.isLoading = true

        const transactionData = {
          total_amount: this.harvestAmount,
          expe_amount: this.harvestAmount,
          income_date: this.harvestDate,
          income_amount: this.harvestIncome,
          cattle_name: this.cattleKind,
          production_good: this.productData
        }

        const cattle = this.cattleKindList.find(
          cattle => cattle.cattle_name === this.cattleKind
        )

        const updateCattleData = {
          cattle_name: cattle.cattle_name,
          production_good: cattle.production_good,
          cattle_amount: cattle.cattle_amount - this.harvestAmount
        }

        await this.$http.$post(`harvests/`, transactionData)
        await this.$http.$put(`cattles/${cattle.id}`, updateCattleData)
        this.$validator.reset()
        this.getHarvestData()
        this.transactionDialog = false
        this.isLoading = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
