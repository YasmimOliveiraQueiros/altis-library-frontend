<template>
  <div class="sidebar">

    <div class="logo">
      <q-icon name="menu_book" size="36px" />
    </div>

    <q-list class="menu-list">

      <q-item
        clickable
        to="/"
        exact
        active-class="menu-item-active"
      >
        <q-item-section avatar>
          <q-icon name="dashboard" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Dashboard</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        to="/alugueis"
        active-class="menu-item-active"
      >
        <q-item-section avatar>
          <q-icon name="menu_book" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Aluguéis</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        to="/livros"
        active-class="menu-item-active"
      >
        <q-item-section avatar>
          <q-icon name="book" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Livros</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        to="/editoras"
        active-class="menu-item-active"
      >
        <q-item-section avatar>
          <q-icon name="business" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Editoras</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        to="/usuarios"
        active-class="menu-item-active"
      >
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Usuários</q-item-label>
        </q-item-section>
      </q-item>

    </q-list>

    <div class="admin">
      Admin
    </div>

  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1B3A5C;
  color: white;
}

.logo {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.menu-list {
  padding-top: 12px;
}

.menu-item-active {
  background-color: rgba(255, 255, 255, 0.22);
  border-radius: 6px;
  margin: 4px 8px;
}

.admin {
  margin-top: auto;
  padding: 25px;
  text-align: center;
  font-weight: 600;
}
</style>