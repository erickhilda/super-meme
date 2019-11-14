<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <v-card class="ma-2 card--widget">
          <v-app-bar dense="" color="primary" flat="" dark="">
            <v-toolbar-title>Data Hewan Ternak</v-toolbar-title>
            <v-spacer />
            <v-btn
              color="white"
              outlined=""
              @click="addNewCattleDialog = !addNewCattleDialog"
            >
              Inputan Baru
            </v-btn>
          </v-app-bar>
          <v-data-table
            :headers="headers"
            :loading="isLoading"
            loading-text="Load data, Please wait..."
            no-data-text="There is no data here"
            :items="cattlesData"
            :items-per-page="10"
            class="elevation-1"
          >
            <template #item.id="{ item }">
              <v-btn
                small=""
                rounded=""
                color="success"
                @click="onOpenUpdateDialogClicked(item)"
                >Update</v-btn
              >
            </template>
          </v-data-table>
        </v-card>
        <v-dialog v-model="addNewCattleDialog" width="600">
          <v-card :loading="isLoading">
            <v-card-title class=" white--text headline primary" primary-title>
              Masukkan Ternak Baru
            </v-card-title>

            <v-card-text>
              <v-container fluid="">
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="cattleName"
                      v-validate="'required'"
                      :error-messages="errors.collect('Nama Ternak')"
                      label="Nama Ternak"
                      data-vv-name="cattleName"
                      required
                      filled=""
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="productData"
                      v-validate="'required'"
                      :items="productList"
                      :error-messages="errors.collect('Jenis Produk')"
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
                      v-model="cattleAmount"
                      v-validate="'required|max:10'"
                      :error-messages="errors.collect('Jumlah Ternak')"
                      label="Jumlah Ternak"
                      data-vv-name="cattleAmount"
                      required
                      filled=""
                    />
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
                @click="onAddNewCattleSubmit()"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="updateCattleDialog" width="600">
          <v-card :loading="isLoading">
            <v-card-title class=" white--text headline primary" primary-title>
              Masukkan Ternak Baru
            </v-card-title>

            <v-card-text>
              <v-container fluid="">
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="updatedCattleName"
                      v-validate="'required'"
                      :error-messages="errors.collect('Nama Ternak')"
                      label="Nama Ternak"
                      data-vv-name="cattleName"
                      required
                      filled=""
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="updatedProductData"
                      v-validate="'required'"
                      :items="productList"
                      :error-messages="errors.collect('Jenis Produk')"
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
                      v-model="updatedCattleAmount"
                      v-validate="'required|max:10'"
                      :error-messages="errors.collect('Jumlah Ternak')"
                      label="Jumlah Ternak"
                      data-vv-name="cattleAmount"
                      required
                      filled=""
                    />
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
                @click="onSubmitUpdateCattleClicked()"
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
  data() {
    return {
      headers: [
        {
          text: 'Nama Ternak',
          align: 'left',
          sortable: false,
          value: 'cattle_name'
        },
        { text: 'Jumlah Ternak', value: 'cattle_amount' },
        { text: 'Jenis Produk', value: 'production_good' },
        { text: 'Aksi', align: 'center', value: 'id' }
      ],
      cattlesData: [],
      cattleName: null,
      cattleAmount: null,
      productData: null,
      productList: [],
      addNewCattleDialog: false,
      isLoading: false,
      updateCattleDialog: false,

      currentCattle: null,
      updatedCattleName: null,
      updatedProductData: null,
      updatedCattleAmount: null
    }
  },
  watch: {
    currentCattle: {
      handler(cattle) {
        if (cattle !== null) {
          this.updatedCattleName = cattle.cattle_name
          this.updatedProductData = cattle.production_good
          this.updatedCattleAmount = cattle.cattle_amount
        }
      }
    }
  },
  created() {
    this.getCattle()
    this.getProductGood()
  },
  methods: {
    async getCattle() {
      try {
        const cattles = await this.$http.$get(`cattles`)
        this.cattlesData = cattles
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
    async onAddNewCattleSubmit() {
      try {
        this.isLoading = true
        const cattleData = {
          cattle_name: this.cattleName,
          cattle_amount: this.cattleAmount,
          production_good: this.productData
        }
        await this.$http.$post(`cattles/`, cattleData)
        this.$validator.reset()
        this.getCattle()
        this.isLoading = false
        this.addNewCattleDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    onOpenUpdateDialogClicked(cattle) {
      this.updateCattleDialog = true
      this.currentCattle = cattle
    },
    async onSubmitUpdateCattleClicked() {
      try {
        this.isLoading = true
        const updatedData = {
          cattle_name: this.updatedCattleName,
          production_good: this.updatedProductData,
          cattle_amount: this.updatedCattleAmount
        }
        await this.$http.$put(
          `http://localhost:1337/cattles/${this.currentCattle.id}`,
          updatedData
        )
        this.$validator.reset()
        this.getCattle()
        this.isLoading = false
        this.updateCattleDialog = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
