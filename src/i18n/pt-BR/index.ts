export default {
  auth: {
    brand: { subtitle: 'Sistema de gestão de aluguéis' },
    fields: {
      email: 'E-mail',
      emailPlaceholder: "seuemail{'@'}email.com",
      password: 'Senha',
      passwordPlaceholder: 'Digite sua senha',
      fullName: 'Nome completo',
      namePlaceholder: 'Seu nome',
      birthDate: 'Data de nascimento', cpf: 'CPF',
      phone: 'Telefone',
      phonePlaceholder: '(85) 99999-9999',
      cpfPlaceholder: '000.000.000-00',
      address: 'Endereço completo',
      addressPlaceholder: 'Rua das Flores, 123, Centro',
      confirmPassword: 'Confirmar senha',
      confirmPasswordPlaceholder: 'Confirme sua senha',
      newPasswordPlaceholder: 'Digite sua nova senha',
      confirmNewPasswordPlaceholder: 'Confirme sua nova senha',
    },
    login: {
      title: 'Bem-vindo de volta!',
      subtitle: 'Faça login para acessar o sistema',
      submit: 'Entrar',
      recoverPassword: 'Recuperar senha?',
      register: 'Realizar cadastro?',
    },

    register: { title: 'Cadastrar nova conta', submit: 'Cadastrar' },
    recovery: {
      title: 'Recuperar senha',
      adminLink: 'Você é usuário administrador?',
      adminMessageFirst: 'A Altis+ Biblioteca percebeu que você deseja',
      adminMessageSecond: 'alterar sua senha.',
      adminGuidance: 'Entre em contato com o suporte pelos meios de comunicação abaixo!',
      adminThanks: 'Altis+ Biblioteca agradece seu contato.', or: 'ou',
    },

    actions: {
      confirm: 'Confirmar',
      back: 'Voltar',
      backToLogin: 'Voltar ao Login' },

    validation: {
      emailRequired: 'Informe seu e-mail',
      emailInvalid: 'Informe um e-mail válido',
      passwordRequired: 'Informe sua senha',
      nameRequired: 'Informe seu nome',
      birthDateRequired: 'Informe sua data de nascimento',
      birthDatePast: 'Informe uma data anterior a hoje',
      cpfRequired: 'Informe seu CPF',
      cpfInvalid: 'Digite um CPF válido',
      phoneRequired: 'Informe seu telefone',
      phoneInvalid: 'Digite um telefone válido',
      addressRequired: 'Informe seu endereço',
      passwordMin: 'A senha deve ter no mínimo 15 caracteres',
      confirmPasswordRequired: 'Confirme sua senha',
      passwordMismatch: 'As senhas não coincidem',
    },

    errors: {
      serviceUnavailable: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      invalidCredentials: 'E-mail ou senha inválidos. Tente novamente.',
      generic: 'Não foi possível entrar. Tente novamente.',
      validation: 'Confira os dados informados e tente novamente.',
      registrationConflict: 'Este e-mail ou CPF já está cadastrado.',
      registrationGeneric: 'Não foi possível realizar o cadastro. Tente novamente.',
      identityVerification: 'Não foi possível validar os dados informados. Confira o e-mail e o CPF e tente novamente.',
      passwordReset: 'Não foi possível redefinir a senha. Confira os dados e tente novamente.',
    },
    success: {
      registration: 'Cadastro realizado com sucesso!',
      passwordReset: 'Senha redefinida com sucesso!' },
  },

  adminDashboard: {
    statistics: 'Estatísticas', monthlyLoans: 'Empréstimos por mês', loading: 'Carregando dados…',
    monthlyError: 'Não foi possível carregar os dados mensais.', monthDescription: 'Empréstimos em {month} de {year}: {count}',
    noMonthlyData: 'Nenhum dado mensal disponível.', booksByStatus: 'Livros por status',
    recentLoans: 'Empréstimos recentes', viewAll: 'Ver todos', recentLoansError: 'Não foi possível carregar os últimos aluguéis.',
    noRecentLoans: 'Nenhum aluguel recente encontrado.', referencesFallback: 'Alguns nomes não puderam ser carregados; os IDs estão sendo exibidos.',
    expectedPrefix: 'Prevista:', availableBooks: 'Disponíveis', rentedBooks: 'Alugados',
    loadError: 'Não foi possível carregar o dashboard. Tente novamente.',
  },
  books: {
    stats: { copies: 'Exemplares',
      thisPage: 'Livros nesta página',
      total: 'Total na consulta' },

    actions: {
      new: '+ Novo livro',
      retry: 'Tentar novamente',
      edit: 'Editar livro',
      delete: 'Excluir livro',
      cancel: 'Cancelar',
      save: 'Salvar' },

    searchPlaceholder: 'Buscar por título, autor ou observações',
    sort: {
      label: 'Ordenar por',
      ascending: 'Crescente',
      descending: 'Decrescente',
      toggleAria: 'Ordenação {direction}. Alterar direção' },

    table: {
      title: 'Título',
      author: 'Autor',
      publisher: 'Editora',
      quantity: 'Quantidade disponível',
      status: 'Status registrado',
      actions: 'Ação' },

    publisherNotFound: 'Editora não localizada',
    empty: {
      search: 'Nenhum livro encontrado para esta pesquisa.',
      list: 'Ainda não há livros cadastrados.' },

    pagination: {
      rowsPerPage: 'Linhas por página',
      previous: 'Página anterior',
      next: 'Próxima página',
      page: 'Página {current} de {total}',
      noPages: 'Nenhuma página' },

    status: {
      available: 'Disponível (registrado)',
      rented: 'Alugado (registrado)' },

    form: {
      editTitle: 'Editar livro',
      newTitle: 'Novo livro',
      title: 'Título',
      titlePlaceholder: 'Título do livro',
      author: 'Autor',
      authorPlaceholder: 'Nome do autor',
      publisher: 'Editora',
      publisherPlaceholder: 'Selecione uma editora',
      quantity: 'Quantidade disponível',
      observations: 'Observações (opcional)',
      publishersLoading: 'Carregando editoras...',
      publishersError: 'Não foi possível carregar as editoras',
      noPublishers: 'Nenhuma editora disponível',
    },

    validation: {
      titleRequired: 'Informe o título',
      authorRequired: 'Informe o autor',
      publisherRequired: 'Selecione uma editora',
      quantityRequired: 'Informe a quantidade',
      quantityInteger: 'Informe um número inteiro',
      quantityNonnegative: 'A quantidade não pode ser negativa',
    },

    delete: {
      title: 'Excluir livro',
      message: 'Tem certeza que deseja excluir o livro' },

    errors: {
      serviceUnavailable: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      validation: 'Confira os dados informados e tente novamente.',
      load: 'Não foi possível carregar os livros. Tente novamente.',
      publishersLoad: 'Não foi possível carregar as editoras.',
      publisherNamesUnavailable: 'Os livros continuam disponíveis; os nomes das editoras podem não ser exibidos.',
      updateIdMissing: 'Não foi possível identificar o livro para atualização.', update: 'Não foi possível atualizar o livro. Verifique os dados e tente novamente.',
      create: 'Não foi possível cadastrar o livro. Verifique os dados e tente novamente.',
      delete: 'Não foi possível excluir o livro. Tente novamente.',
      deleteConflict: 'Não é possível excluir este livro porque existem empréstimos vinculados a ele.',
      notFound: 'Este livro não foi encontrado.',
      unauthorized: 'Sua autenticação expirou. Entre novamente para continuar.', forbidden: 'Você não tem permissão para excluir este livro.',
      server: 'Ocorreu um erro ao excluir o livro. Tente novamente.',
    },
    success: { deleted: 'Livro excluído com sucesso.' },
  },
  publishers: {
    stats: {
      publishers: 'Editoras',
      linkedBooks: 'Livros vinculados',
      linkedBooksTitle: 'Soma dos livros vinculados às editoras desta página carregada' },

    actions: {
      new: '+ Nova editora',
      edit: 'Editar editora',
      delete: 'Excluir editora',
      cancel: 'Cancelar',
      save: 'Salvar' },

    searchPlaceholder: 'Buscar por nome ou e-mail',
    empty: 'Dados serão carregados pelo servidor.',

    table: {
      name: 'Nome',
      email: 'E-mail',
      books: 'Livros cadastrados',
      status: 'Status',
      actions: 'Ação' },

    status: {
      active: 'Ativa',
      inactive: 'Inativa' },

    form: {
      editTitle: 'Editar editora',
      newTitle: 'Nova editora',
      name: 'Nome da editora',
      namePlaceholder: 'Nome da editora',
      email: 'E-mail',
      emailPlaceholder: 'E-mail',
      cnpj: 'CNPJ',
      cnpjPlaceholder: '00.000.000/0000-00',
      cityState: 'Cidade',
      cityStatePlaceholder: 'Cidade - UF',
      books: 'Livros cadastrados',
      status: 'Status',
    },
    validation: {
      nameRequired: 'Informe o nome da editora',
      emailRequired: 'Informe o e-mail',
      emailInvalid: 'Informe um e-mail válido',
      cnpjRequired: 'Informe o CNPJ',
      cityStateRequired: 'Informe a cidade e a UF',
      cityStateFormat: 'Informe no formato Cidade - UF',
    },

    delete: {
      title: 'Excluir editora',
      message: 'Tem certeza que deseja excluir a editora' },

    errors: {
      load: 'Não foi possível carregar as editoras. Tente novamente.', updateIdMissing: 'Não foi possível identificar a editora para atualização.',
      serviceUnavailable: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      validation: 'Confira os dados informados e tente novamente.',
      unauthorized: 'Sua autenticação expirou. Entre novamente para continuar.',
      forbidden: 'Você não tem permissão para realizar esta ação.',
      create: 'Não foi possível cadastrar a editora. Tente novamente.',
      update: 'Não foi possível atualizar a editora. Tente novamente.',
      delete: 'Não foi possível excluir a editora. Verifique os dados e tente novamente.',
      hasLinkedBooks: 'Esta editora não pode ser excluída porque possui {count} livro(s) vinculado(s).',
      linkedBooksUnknown: 'Não foi possível confirmar se esta editora possui livros vinculados. A exclusão foi bloqueada.',
      deleteLinkedBooks: 'Não foi possível excluir esta editora porque há livros vinculados. Remova ou reassocie esses livros e tente novamente.',
    },

    success: {
      created: 'Editora cadastrada com sucesso.',
      updated: 'Editora atualizada com sucesso.',
      deleted: 'Editora excluída com sucesso.' },
  },
  users: {
    stats: {
      active: 'Ativos',
      inactive: 'Inativos',
      total: 'Total' },

    searchPlaceholder: 'Buscar por nome ou e-mail',
    actions: {
      activate: 'Ativar',
      deactivate: 'Inativar' },

    table: {
      name: 'Nome',
      email: 'E-mail',
      phone: 'Telefone',
      loans: 'Livros alugados',
      status: 'Status',
      action: 'Ação' },

    status: {
      active: 'Ativo',
      inactive: 'Inativo' },

    empty: 'Nenhum usuário encontrado.',
    pagination: {
      rowsPerPage: 'Linhas por página',
      previous: 'Página anterior',
      next: 'Próxima página',
      page: 'Página {current} de {total} ({count} na pesquisa)',
      noPages: 'Nenhuma página',
    },
    success: {
      activated: 'Usuário ativado com sucesso.',
      deactivated: 'Usuário inativado com sucesso.' },

    errors: {
      serviceUnavailable: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      unauthorized: 'Sua autenticação expirou. Entre novamente para continuar.',
      forbidden: 'Você não tem permissão para realizar esta ação.',
      generic: 'Não foi possível concluir a operação. Tente novamente.',
    },
  },
  loans: {
    stats: {
      pending: 'Pendentes',
      overdue: 'Atrasados',
      returned: 'Devolvidos',
      total: 'Total' },

    actions: {
      new: '+ Novo aluguel',
      retry: 'Tentar novamente',
      rowActions: 'Ações do aluguel',
      edit: 'Editar',
      registerReturn: 'Registrar devolução',
      cancel: 'Cancelar',
      save: 'Salvar' },

    searchPlaceholder: 'Buscar por locatário ou livro',

    status: {
      all: 'Todos os status',
      pending: 'Pendente',
      overdue: 'Atrasado',
      returned: 'Devolvido',
      returnedLate: 'Devolvido com atraso' },

    table: {
      borrower: 'Locatário',
      book: 'Livro',
      loanDate: 'Aluguel',
      returnDate: 'Devolução',
      status: 'Status',
      actions: 'Ação' },

    references: {
      userFallback: 'Usuário #{id}',
      bookFallback: 'Livro #{id}' },

    empty: {
      filtered: 'Nenhum aluguel encontrado para estes filtros.',
      list: 'Ainda não há aluguéis cadastrados.' },

    pagination: {
      rowsPerPage: 'Linhas por página',
      previous: 'Página anterior',
      next: 'Próxima página',
      page: 'Página {current} de {total}',
      noPages: 'Nenhuma página' },

    form: {
      editTitle: 'Editar aluguel',
      newTitle: 'Novo aluguel',
      borrower: 'Locatário',
      book: 'Livro',
      loanDate: 'Data do aluguel',
      returnDate: 'Data prevista de devolução',
      observations: 'Observações (opcional)',
      noUsers: 'Nenhum usuário disponível',
      noBooks: 'Nenhum livro disponível',
    },

    validation: {
      borrowerRequired: 'Selecione um locatário válido',
      bookRequired: 'Selecione um livro válido',
      loanDateRequired: 'Informe a data do aluguel',
      returnDateRequired: 'Informe a data prevista de devolução',
      returnDateAfterLoan: 'A devolução não pode ser anterior ao empréstimo',
    },
    return: {
      title: 'Registrar devolução',
      confirmation: 'Confirma a devolução do empréstimo #{id}?',
      confirm: 'Confirmar devolução' },

    success: { returned: 'Devolução registrada com sucesso.' },

    errors: {
      dashboardForbidden: 'Você não tem permissão para visualizar as estatísticas.', dashboardLoad: 'Não foi possível carregar as estatísticas de empréstimos.',
      serviceUnavailable: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      load: 'Não foi possível carregar os aluguéis. Tente novamente.', referencesFallback: 'Os IDs serão exibidos até que os dados possam ser carregados.',
      referencesLoad: 'Não foi possível carregar os nomes de usuários e livros.',
      userNotFound: 'O usuário selecionado não foi encontrado.',
      bookNotFound: 'O livro selecionado não foi encontrado.',
      bookUnavailable: 'O livro não possui exemplares disponíveis para empréstimo.', loanLimit: 'O usuário atingiu o limite de cinco empréstimos ativos.',
      invalidDates: 'As datas informadas são inválidas. Confira o período do empréstimo.',
      cannotChangeReferences: 'Não é permitido alterar o usuário ou o livro de um empréstimo.',
      updateConflict: 'O empréstimo não pode ser editado devido às regras do servidor.',
      createConflict: 'O empréstimo conflita com uma regra do servidor. Verifique os dados e tente novamente.',
      save: 'Não foi possível salvar o empréstimo. Verifique os dados e tente novamente.',
      loanIdMissing: 'Não foi possível identificar o empréstimo para edição.',
      return: 'Não foi possível registrar a devolução. Tente novamente.', loanNotFound: 'Este empréstimo não foi encontrado.',
      returnConflict: 'Este empréstimo já foi devolvido ou não pode ser devolvido.',
    },
  },
  profile: {
    editProfile: 'Editar perfil',
    personalData: 'Dados pessoais',
    passwordSection: 'Alteração de senha (opcional)',
    currentPassword: 'Senha atual',
    newPassword: 'Nova senha',
    confirmPassword: 'Confirmar nova senha',
    togglePassword: 'Mostrar ou ocultar senha',
    saveChanges: 'Salvar alterações',
    passwordFieldsRequired: 'Preencha os três campos para alterar a senha.',
    partialUpdate: 'Dados pessoais salvos, mas a senha não foi alterada: {error}',
    errors: { generic: 'Não foi possível concluir a operação.', conflict: 'A solicitação conflita com os dados atuais.', currentPassword: 'A senha atual está incorreta.' },
    success: { profile: 'Dados pessoais atualizados com sucesso.', profileAndPassword: 'Perfil e senha atualizados. Entre novamente com sua nova senha.' },
    closeAccount: {
      title: 'Encerrar conta',
      confirmation: 'Você perderá acesso ao sistema. Seu histórico de empréstimos será preservado. Deseja confirmar o encerramento da conta?',
      cancel: 'Cancelar',
      pendingLoans: 'Não foi possível encerrar a conta enquanto houver empréstimos pendentes.',
      success: 'Conta encerrada com sucesso.',
      error: 'Não foi possível encerrar a conta. Tente novamente.',
    },
    languageLabel: 'Alterar idioma',

    language: {
      portuguese: 'Português',
      english: 'Inglês',
      spanish: 'Espanhol',
    },

    logout: 'Sair',
    deleteAccount: 'Encerrar conta',
  },

  navigation: {
    openMenu: 'Abrir menu',
    dashboard: 'Dashboard',
    loans: 'Aluguéis',
    books: 'Livros',
    publishers: 'Editoras',
    users: 'Usuários',
    admin: 'Administrador',
    subtitles: {
      overview: 'Visão geral do sistema',
      loans: 'Controle de empréstimos de livros',
      books: 'Controle de livros',
      publishers: 'Controle de editoras',
      users: 'Controle de usuários',
    },
  },

  readerDashboard: {
    greeting: 'Olá',
    greetingGeneric: 'Olá',
    profileAvatar: 'Ícone de perfil do usuário',
    subtitle: 'Seu painel de leitura',
    activeLoans: 'Alugados',
    latestBook: 'Último livro alugado',
    mostRented: 'Livro mais alugado',
    myLoans: 'Meus aluguéis',
    book: 'Livro',
    loanDate: 'Aluguel',
    returnDate: 'Devolução prevista',
    statusLabel: 'Status',
    noLoans: 'Nenhum aluguel encontrado.',
    historyError:
      'Não foi possível carregar seu histórico completo. Os indicadores não estão disponíveis.',
    tableError: 'Não foi possível carregar seus aluguéis.',
    retry: 'Tentar novamente',
    recordsPerPage: 'Registros por página',
    pagination: '{first}–{last} de {total}',
    emptyPagination: '0 registros',
    status: {
      PENDING: 'Pendente',
      OVERDUE: 'Atrasado',
      RETURNED: 'Devolvido',
      RETURNED_LATE: 'Devolvido com atraso',
    },
  },

  failed: 'Ação falhou',
  success: 'Ação realizada com sucesso',
};
