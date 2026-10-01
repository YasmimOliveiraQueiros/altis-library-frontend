<template>
  <q-page class="q-pa-md">

    <section class="topo">
      <div class="cards">

        <q-card class="card">
          <q-card-section>
            <div class="card-title">
              <span class="indicador ativo"></span>
              Ativos
            </div>

            <div class="card-value">0</div>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section>
            <div class="card-title">
              <span class="indicador inativo"></span>
              Inativos
            </div>

            <div class="card-value">0</div>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section>
            <div class="card-title">
              <span class="indicador total"></span>
              Total
            </div>

            <div class="card-value">0</div>
          </q-card-section>
        </q-card>

      </div>
    </section>


    <section class="pesquisa">

      <q-input
        v-model="campoBusca"
        outlined
        dense
        placeholder="Buscar por nome ou email"
        class="campo-busca"
      />

      <q-select
        v-model="filtroStatus"
        outlined
        dense
        :options="opcoesStatus"
        class="filtro-status"
      />

    </section>

    <section class="tabela">
      <q-table
        flat
        :rows="usuarios"
        :columns="colunas"
        row-key="id"
        hide-pagination
        :rows-per-page-options="[0]"
      />
    </section>
  </q-page>

  
</template>


<script setup lang="ts">
import { ref } from 'vue';
import type { QTableColumn } from 'quasar';

const campoBusca = ref('');
const filtroStatus = ref('Todos os status');

const opcoesStatus = [
  'Todos os status',
  'Ativo',
  'Inativo',
];


const usuarios = ref([]);

const colunas: QTableColumn[] = [
  {
    name: 'nome',
    label: 'Nome',
    field: 'nome',
    align: 'left',
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
  },
  {
    name: 'telefone',
    label: 'Telefone',
    field: 'telefone',
    align: 'left',
  },
  {
    name: 'livros',
    label: 'Livros alugados',
    field: 'livros',
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
  },
  {
    name: 'acao',
    label: 'Ação',
    field: 'acao',
    align: 'left',
  },
];
</script>


<style scoped>
.topo {
  margin-top: 15px;
  margin-bottom: 25px;
}

.cards {
  display: flex;
  gap: 20px;
}

.card {
  width: 115px;
  height: 80px;
  background-color: white;
  border: 1px solid #1B3A5C;
  border-radius: 6px;
}

.card-title {
  color: #1B3A5C;
  font-size: 15px;
}

.indicador {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 2px;
}

.indicador.ativo {
  background-color: #4CAF50;
}

.indicador.inativo {
  background-color: #E94B4B;
}

.indicador.total {
  background-color: #1B3A5C;
}

.card-value {
  margin-top: 0px;
  color: #1B3A5C;
  font-size: 30px;
  text-align: center;
}

.pesquisa {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.campo-busca {
  flex: 1;
}

.filtro-status {
  width: 180px;
}
</style>