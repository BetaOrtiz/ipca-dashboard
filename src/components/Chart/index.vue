<template>
  <div>
    <div class="flex space-between">
      <div class="select">
        <v-select
          :items="availableMonths"
          filled
          label="Selecione mês inicial"
          v-model="periodSelected.monthInitial"
        ></v-select>
      </div>

      <div class="select">
        <v-select
          :items="possibleFinalMonths"
          filled
          label="Selecione mês final"
          v-model="periodSelected.monthFinal"
        ></v-select>
      </div>
    </div>

    <v-radio-group v-model="variationSelected" row>
      <v-radio
        v-for="variavel in variations"
        :key="variavel"
        :label="variavel"
        :value="variavel"
      ></v-radio>
    </v-radio-group>

    <!-- <div>
      <v-select
        :items="groups"
        filled
        label="Selecione o grupo"
        v-model="selectedGroup"
      ></v-select>
    </div> -->

    <!-- <v-select
      v-model="selectedGroup"
      :items="groups"
      label="Select Item"
      multiple
    >
      <template v-slot:selection="{ item, index }">
        <v-chip v-if="index === 0">
          <span>{{ item }}</span>
        </v-chip>
        <span v-if="index === 1" class="grey--text caption">
          (+{{ groups.length - 1 }} others)
        </span>
      </template>
    </v-select> -->

    <v-select
      v-model="selectedGroup"
      :items="groups"
      attach
      chips
      label="Grupos"
      multiple
    ></v-select>

    <button @click="loadChart" class="btn" id="data">
      PESQUISAR
    </button>

    <div v-if="!ipcaData.length && !errors">
      <v-col class="subtitle-1 text-center" cols="12">
        Carregando dados...
      </v-col>

      <v-progress-linear indeterminate color="yellow darken-2" />
    </div>

    <v-alert border="top" color="red lighten-2" dark v-if="errors">
      {{ errors }}
    </v-alert>

    <div v-else class="column">
      <div id="chart-title" v-if="title.monthInitial">
        <strong>
          {{ title.variationSelected }}
        </strong>
        <p>
          {{ title.monthInitial }} -
          {{ title.monthFinal }}
        </p>
      </div>

      <apexchart
        v-if="title.monthInitial"
        width="100%"
        type="line"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import './styles.css';
import '../../styles/global.css';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: [
    'ipcaData',
    'availableMonths',
    'variations',
    'groups',
    'error',
  ],
  created() {
    // if (this.ipcaData.length <= 0) {
    //   this.$router.push('/');
    //   return;
    // }

    window.scrollTo(0, 380);

    this.loadChart();
  },
  data() {
    return {
      errors: this.error,
      variationSelected: 'IPCA - Variação mensal',
      options: {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories: [],
        },
      },
      series: [
        {
          name: '',
          data: [],
        },
      ],
      periodSelected: {
        initial: '',
        final: '',
        monthInitial: this.availableMonths[1],
        monthFinal: this.availableMonths[0],
      },
      selectedGroup: [],
      title: {
        variationSelected: this.variationSelected,
        monthInitial: this.availableMonths[1],
        monthFinal: this.availableMonths[0],
        selectedGroup: this.selectedGroup,
      },
    };
  },
  computed: {
    possibleFinalMonths: function() {
      if (this.periodSelected.monthInitial) {
        const i = this.availableMonths.indexOf(
          this.periodSelected.monthInitial,
        );
        const finalMonths = this.availableMonths.slice(0, i);
        return finalMonths;
      } else {
        return this.availableMonths;
      }
    },
  },
  methods: {
    /*estes métodos filtram os dados retornados pela API de acordo com as opções selecionadas pelo usuário
    embora fosse possível trabalhar o mesmo array inicial para cada filtro disponível ao usuário, visando menor acoplamento
    entre eles, no longo prazo a tendência será que o retorno da API seja cada vez maior, portanto, a decisão tomada
    foi a de realizar a invocação de um método dentro do método seguinte, preferindo performance que reusabilidade.*/

    loadChart: function() {
      window.scrollTo(0, 750);
      this.errors = '';
      this.series = [];
      try {
        this.setDataToPlot();
        this.title = {
          variationSelected: this.variationSelected,
          monthInitial: this.availableMonths[1],
          monthFinal: this.availableMonths[0],
          selectedGroup: this.selectedGroup,
        };
      } catch (err) {
        this.errors = 'Selecione o período para pesquisar';
      }
    },
    filterByVariation: function() {
      const filteredByVariation = this.ipcaData.filter(
        item => item.D2N === this.variationSelected,
      );

      return filteredByVariation;
    },
    filterByMonths: function() {
      const filteredByVariation = this.filterByVariation();

      const firstInitialMonthOccurrence = filteredByVariation.find(
        item =>
          item.D3N === this.periodSelected.monthInitial.toLowerCase(),
      );

      const firstFinalMonthOccurence = filteredByVariation.filter(
        item =>
          item.D3N === this.periodSelected.monthFinal.toLowerCase(),
      );

      this.periodSelected = {
        ...this.periodSelected,
        initial: this.ipcaData.indexOf(firstInitialMonthOccurrence),
        final: this.ipcaData.indexOf(
          firstFinalMonthOccurence[
            firstFinalMonthOccurence.length - 1
          ],
        ),
      };

      const filteredByMonth = this.ipcaData.slice(
        this.periodSelected.initial,
        this.periodSelected.final,
      );

      return filteredByMonth;
    },
    filterByGroup: function() {
      const filteredByMonth = this.filterByMonths();

      const filteredByGroup = this.selectedGroup.map(item =>
        filteredByMonth.filter(x => x.D4N === item),
      );

      // const filteredByGroup = filteredByMonth.filter(
      //   item => item.D4N === this.selectedGroup,
      // );

      //console.log(filteredByGroup);

      return filteredByGroup;
    },
    setDataToPlot: function() {
      const filteredByGroup = this.filterByGroup();

      //const monthsToPlot

      const monthsToPlot = filteredByGroup.map(item =>
        item.map(element => element.D3N),
      );

      console.log(monthsToPlot[0]);

      this.options = {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories: monthsToPlot[0],
        },
      };

      //const dataToPlot = filteredByGroup.map(item => item.V);

      filteredByGroup.forEach(group => {
        const objToPlot = {};
        objToPlot.name = group[0].D4N;

        let data = [];
        group.forEach(item => data.push(item.V));
        objToPlot.data = data;

        this.series.push(objToPlot);
      });
    },
  },
};
</script>

<style></style>
