<template>
  <q-page class="dashboard-page">

    <section class="summary-cards">

      <q-card class="summary-card">
        <span class="card-indicator livros"></span>
        <span>Livros</span>
        <strong>0</strong>
      </q-card>

      <q-card class="summary-card">
        <span class="card-indicator editoras"></span>
        <span>Editoras</span>
        <strong>0</strong>
      </q-card>

      <q-card class="summary-card">
        <span class="card-indicator alugados"></span>
        <span>Alugados</span>
        <strong>0</strong>
      </q-card>

      <q-card class="summary-card">
        <span class="card-indicator usuarios"></span>
        <span>Usuários</span>
        <strong>0</strong>
      </q-card>

      <q-card class="summary-card">
        <span class="card-indicator pendentes"></span>
        <span>Pendentes</span>
        <strong>0</strong>
      </q-card>

      <q-card class="summary-card">
        <span class="card-indicator atrasados"></span>
        <span>Atrasados</span>
        <strong>0</strong>
      </q-card>

    </section>

    <section class="dashboard-content">

      <q-card class="dashboard-card">
        <div class="card-title">
          Empréstimos por mês
        </div>

        <div class="empty-content">
          Dados serão carregados pelo backend.
        </div>
      </q-card>

      <q-card class="dashboard-card">
        <div class="card-title">
          Livros por status
        </div>

        <div class="empty-content">
          Dados serão carregados pelo backend.
        </div>
      </q-card>

    </section>

    <q-card class="recent-loans">
      <div class="card-title">
        Empréstimos recentes
      </div>

      <div class="empty-content">
        Dados serão carregados pelo backend.
      </div>
    </q-card>

  </q-page>
</template>

<style scoped>
.dashboard-page {
  padding: 15px 20px;
  background-color: #ffffff;
}

.page-header {
  margin-bottom: 15px;
}

.page-header h1 {
  margin: 0;
  color: #1B3A5C;
  font-size: 24px;
}

.page-header p {
  margin: 2px 0 0;
  color: #555;
}

.summary-cards {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.summary-card {
  width: 115px;
  height: 80px;
  padding: 8px;
  background-color: #ffffff;
  border: 1px solid #1B3A5C;
  border-radius: 6px;
  box-shadow: none;
}

.summary-card span:not(.card-indicator) {
  color: #1B3A5C;
  font-size: 13px;
}

.summary-card strong {
  display: block;
  margin-top: 8px;
  color: #1B3A5C;
  font-size: 30px;
  line-height: 30px;
  font-weight: 600;
  text-align: center;
}

.card-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 5px;
  border-radius: 50%;
}

.livros {
  background: #3F78D4;
}

.editoras {
  background: #9C3FC4;
}

.alugados {
  background: #19A974;
}

.usuarios {
  background: #1B3A5C;
}

.pendentes {
  background: #F5A623;
}

.atrasados {
  background: #E94B4B;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.dashboard-card,
.recent-loans {
  background-color: #ffffff;
  border: 1px solid #1B3A5C;
  border-radius: 6px;
  box-shadow: none;
}

.dashboard-card {
  min-height: 155px;
}

.card-title {
  padding: 10px;
  color: #1B3A5C;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

.empty-content {
  padding: 30px 10px;
  color: #777;
  text-align: center;
}

.recent-loans {
  min-height: 170px;
}

@media (max-width: 900px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}
</style>