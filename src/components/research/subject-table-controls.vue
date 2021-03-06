<template>
  <v-row class="px-4 justify-space-between align-center">
    <v-col :cols="1">
      <v-text-field label="ID" v-model="filters.id" />
    </v-col>
    <v-col :cols="1">
      <v-text-field
        label="First Name"
        v-model="filters.firstName"
        :disabled="Boolean(filters.id)"
      />
    </v-col>
    <v-col :cols="1">
      <v-text-field
        label="Last Name"
        v-model="filters.lastName"
        :disabled="Boolean(filters.id)"
      />
    </v-col>
    <v-col :cols="3">
      <v-row class="align-center">
        <v-col>
          <v-menu v-model="bornAfterMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field
                clearable
                readonly
                label="Born After"
                prepend-icon="event"
                v-model="filters.bornAfter"
                v-on="on"
                :disabled="Boolean(filters.id)"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="filters.bornAfter"
              @input="bornAfterMenu = false"
              scrollable
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu v-model="bornBeforeMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-text-field
                clearable
                readonly
                label="Born Before"
                v-model="filters.bornBefore"
                v-on="on"
                :disabled="Boolean(filters.id)"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="filters.bornBefore"
              @input="bornBeforeMenu = false"
              scrollable
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-col>

    <v-col :cols="1">
      <v-select
        clearable
        label="Sex"
        v-model="filters.sex"
        :disabled="Boolean(filters.id)"
        :items="sexItems"
      />
    </v-col>
    <v-col :cols="1">
      <v-select
        clearable
        label="Gender"
        v-model="filters.gender"
        :disabled="Boolean(filters.id)"
        :items="genderItems"
      />
    </v-col>
    <v-col :cols="1">
      <v-select
        clearable
        label="Dominant Hand"
        v-model="filters.dominantHand"
        :disabled="Boolean(filters.id)"
        :items="dominantHandItems"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import { sexOptions, genderOptions, dominantHandOptions } from './choices.js'
import { createSelectItems } from '@/components/utils'

export default {
  name: 'SubjectTableControls',
  props: { options: Object },
  created() {
    this.update()
  },
  data: () => ({
    bornAfterMenu: false,
    bornBeforeMenu: false,
    filters: {
      id: '',
      firstName: '',
      lastName: '',
      bornAfter: '',
      bornBefore: '',
      sex: '',
      gender: '',
      dominantHand: ''
    },
    sexItems: createSelectItems(sexOptions),
    genderItems: createSelectItems(genderOptions),
    dominantHandItems: createSelectItems(dominantHandOptions),
    snakeCaseNames: {
      idNumber: 'id_number',
      firstName: 'first_name',
      lastName: 'last_name',
      dateOfBirth: 'date_of_birth'
    }
  }),
  methods: {
    update() {
      this.$emit('fetch-subjects-start')
      let options = Object.assign({}, this.options)
      options['sortBy'] = options['sortBy'].map(
        key => this.snakeCaseNames[key] || key
      )
      let query = { filters: this.filters, options: options }
      this.fetchSubjects(query).then(() => {
        this.$emit('fetch-subjects-end')
      })
    },
    ...mapActions('research', ['fetchSubjects'])
  },
  watch: {
    filters: {
      handler() {
        this.update()
      },
      deep: true
    },
    options: {
      handler() {
        this.update()
      },
      deep: true
    }
  }
}
</script>

<style scoped></style>
