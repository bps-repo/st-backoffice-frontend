import { Component, OnInit, inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TabView, TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { Task } from '../../models/task.model';
import { TASK_DATA } from 'src/app/shared/tokens/task.token';

@Component({
  selector: 'app-todas-tarefas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    BadgeModule,
    TabViewModule,
    ProgressBarModule
  ],
  templateUrl: './todas-tarefas.component.html',
})
export class TodasTarefasComponent implements OnInit, AfterViewInit {
  // Dados gerais
  searchText: string = '';
  selectedTurma: any = null;
  selectedNivel: any = null;
  selectedCentro: any = null;

  // Dados para os cards de resumo
  summaryCards = [
    { title: 'Contratos Terminando', count: 3, icon: 'pi pi-file-edit', class: 'bg-blue-100', route: 'contratos' },
    { title: 'Parcelas a Vencer', count: 5, icon: 'pi pi-calendar', class: 'bg-green-100', route: 'parcelas-vencer' },
    { title: 'Parcelas Vencidas', count: 2, icon: 'pi pi-exclamation-triangle', class: 'bg-red-100', route: 'parcelas-vencidas' },
    { title: 'Ausências Longas', count: 4, icon: 'pi pi-user-minus', class: 'bg-purple-100', route: 'ausencias' }
  ];

  // Opções para os dropdowns
  turmaOptions = [{ label: 'Todas', value: null }];
  nivelOptions = [
    { label: 'Todos', value: null },
    { label: 'A1', value: 'A1' },
    { label: 'A2', value: 'A2' },
    { label: 'B1', value: 'B1' },
    { label: 'B2', value: 'B2' }
  ];
  centroOptions = [{ label: 'Todos', value: null }];

  // Dados para as diferentes abas
  contratosTerminando: any[] = [];
  parcelasVencer: any[] = [];
  parcelasVencidas: any[] = [];
  ausenciasLongas: any[] = [];

  // Aba ativa
  activeTabIndex: number = 0;

  // Estado de carregamento
  carregando: boolean = true;
  erroCarregamento: boolean = false;
  mensagemErro: string = '';
  tentativasCarregamento: number = 0;
  maxTentativas: number = 3;

  // Injetar os dados da tarefa usando o token
  taskData = inject(TASK_DATA);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // Inicialização básica
  }

  ngAfterViewInit() {
    // Inicializar dados após a renderização da view
    setTimeout(() => {
      // Descomentar a linha abaixo para testar o carregamento normal
      this.carregarDados();

      // Descomentar a linha abaixo para testar o tratamento de erros
      this.simularErroCarregamento();

      this.cdr.detectChanges();
    }, 0);
  }

  // Método para simular um erro de carregamento (apenas para testes)
  simularErroCarregamento() {
    console.log('Simulando erro de carregamento...');
    this.carregando = true;
    this.erroCarregamento = false;
    this.mensagemErro = '';
    this.cdr.detectChanges();

    setTimeout(() => {
      // Simular um erro de rede
      this.tratarErroCarregamento(new Error('network error: connection refused'));
    }, 1500);
  }

  carregarDados() {
    try {
      console.log('Iniciando carregamento de dados... Tentativa ' + (this.tentativasCarregamento + 1) + ' de ' + this.maxTentativas);

      // Incrementar contador de tentativas
      this.tentativasCarregamento++;

      // Atualizar estado
      this.carregando = true;
      this.erroCarregamento = false;
      this.mensagemErro = '';
      this.cdr.detectChanges();

      // Simular um atraso de rede para melhor feedback visual
      setTimeout(() => {
        try {
          // Carregar dados para Contratos Terminando
          this.contratosTerminando = [
            {
              id: 'S001',
              nome: 'João Silva',
              codigo: 'S001',
              curso: 'Inglês Básico',
              nivel: 'Nível A2',
              termino: new Date('2024-02-15'),
              diasRestantes: 22,
              progresso: { atual: 8, total: 12 },
              situacaoFinanceira: 'Em dia'
            },
            {
              id: 'S002',
              nome: 'Maria Santos',
              codigo: 'S002',
              curso: 'Inglês Avançado',
              nivel: 'Nível B2',
              termino: new Date('2024-02-28'),
              diasRestantes: 35,
              progresso: { atual: 15, total: 18 },
              situacaoFinanceira: 'Pendente'
            },
            {
              id: 'S003',
              nome: 'Pedro Costa',
              codigo: 'S003',
              curso: 'Conversação',
              nivel: 'Nível B1',
              termino: new Date('2024-02-10'),
              diasRestantes: 17,
              progresso: { atual: 6, total: 9 },
              situacaoFinanceira: 'Em dia'
            }
          ];

          // Carregar dados para Parcelas a Vencer
          this.parcelasVencer = [
            {
              id: 'S001',
              nome: 'Ana Lima',
              codigo: 'S001',
              curso: 'Inglês Básico',
              parcela: '#3',
              vencimento: new Date('2024-01-27'),
              diasRestantes: 2,
              valor: 150,
              metodo: 'Multicaixa'
            },
            {
              id: 'S002',
              nome: 'Carlos Santos',
              codigo: 'S002',
              curso: 'Conversação',
              parcela: '#5',
              vencimento: new Date('2024-01-28'),
              diasRestantes: 3,
              valor: 100,
              metodo: 'Transferência'
            }
          ];

          // Carregar dados para Parcelas Vencidas
          this.parcelasVencidas = [
            {
              id: 'S001',
              nome: 'Roberto Silva',
              codigo: 'S001',
              curso: 'Inglês Avançado',
              parcela: '#2',
              venceuEm: new Date('2024-01-10'),
              atraso: 15,
              valor: 12000
            },
            {
              id: 'S002',
              nome: 'Lucia Costa',
              codigo: 'S002',
              curso: 'Preparatório TOEFL',
              parcela: '#4',
              venceuEm: new Date('2024-01-05'),
              atraso: 20,
              valor: 12000
            }
          ];

          // Carregar dados para Ausências Longas
          this.ausenciasLongas = [
            {
              id: 'S001',
              nome: 'Fernando Lima',
              codigo: 'S001',
              curso: 'Inglês Básico',
              nivel: 'Nível A1',
              ultimaPresenca: new Date('2023-12-05'),
              diasAusente: 45,
              frequencia: 65,
              progresso: 40
            },
            {
              id: 'S002',
              nome: 'Clara Santos',
              codigo: 'S002',
              curso: 'Conversação',
              nivel: 'Nível B1',
              ultimaPresenca: new Date('2023-11-28'),
              diasAusente: 52,
              frequencia: 45,
              progresso: 30
            }
          ];

          // Resetar contador de tentativas após sucesso
          this.tentativasCarregamento = 0;

          console.log('Dados carregados com sucesso!');
          this.carregando = false;
          this.cdr.detectChanges();
        } catch (innerError) {
          this.tratarErroCarregamento(innerError);
        }
      }, 600); // Atraso para simular carregamento de rede

    } catch (error) {
      this.tratarErroCarregamento(error);
    }
  }

  // Método para tratar erros de carregamento
  private tratarErroCarregamento(error: any) {
    this.registrarErro('Erro ao carregar dados', error);
    this.carregando = false;
    this.erroCarregamento = true;

    // Determinar mensagem de erro apropriada
    if (error instanceof TypeError) {
      this.mensagemErro = 'Erro de formato nos dados. Por favor, contate o suporte técnico.';
    } else if (error instanceof SyntaxError) {
      this.mensagemErro = 'Erro de sintaxe nos dados. Por favor, contate o suporte técnico.';
    } else if (error instanceof Error && error.message.includes('network')) {
      this.mensagemErro = 'Erro de conexão. Verifique sua internet e tente novamente.';
    } else {
      this.mensagemErro = 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.';
    }

    this.cdr.detectChanges();

    // Tentar reiniciar o componente automaticamente apenas se não excedeu o número máximo de tentativas
    if (this.tentativasCarregamento < this.maxTentativas) {
      console.log(`Tentando recarregar automaticamente (${this.tentativasCarregamento}/${this.maxTentativas})...`);
      setTimeout(() => {
        this.reiniciarComponente();
      }, 3000);
    } else {
      console.log('Número máximo de tentativas excedido. Aguardando ação do usuário.');
      this.mensagemErro += ' Número máximo de tentativas excedido. Por favor, recarregue manualmente.';
      this.cdr.detectChanges();
    }
  }

  // Método para registrar erros de forma mais detalhada
  private registrarErro(mensagem: string, erro: any) {
    console.error(mensagem, erro);

    // Informações adicionais para depuração
    const infoErro = {
      timestamp: new Date().toISOString(),
      tentativa: this.tentativasCarregamento,
      tipoErro: erro?.constructor?.name || 'Desconhecido',
      mensagem: erro?.message || 'Sem mensagem de erro',
      stack: erro?.stack,
      navegador: navigator.userAgent,
      url: window.location.href
    };

    console.error('Detalhes do erro:', infoErro);

    // Aqui poderia ser implementado o envio do erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    // this.errorService.reportError(infoErro);
  }

  // Métodos para manipulação de UI
  getSituacaoFinanceiraClass(situacao: string): string {
    return situacao === 'Em dia' ? 'text-green-500' : 'text-red-500';
  }

  getProgressoStyle(atual: number, total: number): string {
    const porcentagem = (atual / total) * 100;
    return `width: ${porcentagem}%`;
  }

  // Métodos para ações
  agendarReuniao(aluno: any) {
    console.log('Agendando reunião com', aluno.nome);
  }

  ignorarAlerta(aluno: any) {
    console.log('Ignorando alerta para', aluno.nome);
  }

  renovarContrato(aluno: any) {
    console.log('Renovando contrato de', aluno.nome);
  }

  gerarRelatorio(aluno: any) {
    console.log('Gerando relatório para', aluno.nome);
  }

  estenderPrazo(parcela: any) {
    console.log('Estendendo prazo da parcela', parcela.parcela, 'do aluno', parcela.nome);
  }

  concluirPagamento(parcela: any) {
    console.log('Concluindo pagamento da parcela', parcela.parcela, 'do aluno', parcela.nome);
  }

  realizarPagamento(parcela: any) {
    console.log('Realizando pagamento da parcela', parcela.parcela, 'do aluno', parcela.nome);
  }

  fecharParcela(parcela: any) {
    console.log('Fechando parcela', parcela.parcela, 'do aluno', parcela.nome);
  }

  inativarParcela(parcela: any) {
    console.log('Inativando parcela', parcela.parcela, 'do aluno', parcela.nome);
  }

  contatarAluno(aluno: any) {
    console.log('Contatando aluno', aluno.nome);
  }

  adicionarNota(aluno: any) {
    console.log('Adicionando nota para', aluno.nome);
  }

  emitirAlerta(aluno: any) {
    console.log('Emitindo alerta para', aluno.nome);
  }

  // Métodos para filtros e exportação
  filtrarDados() {
    console.log('Filtrando dados...');
  }

  exportarDados() {
    console.log('Exportando dados...');
  }

  // Método para mudar de aba
  onTabChange(event: any) {
    console.log('Mudando para a aba:', event.index);
    this.activeTabIndex = event.index;
    // Forçar detecção de mudanças
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  // Método para reiniciar o componente em caso de erro
  reiniciarComponente() {
    console.log('Reiniciando componente...');

    // Resetar contador de tentativas quando o usuário clica manualmente no botão
    if (this.tentativasCarregamento >= this.maxTentativas) {
      console.log('Resetando contador de tentativas após ação manual do usuário');
      this.tentativasCarregamento = 0;
    }

    // Atualizar estado para mostrar carregamento
    this.carregando = true;
    this.erroCarregamento = false;
    this.mensagemErro = '';

    // Forçar detecção de mudanças imediatamente
    this.cdr.detectChanges();

    // Limpar dados com um pequeno atraso para permitir a animação de carregamento
    setTimeout(() => {
      // Limpar dados
      this.contratosTerminando = [];
      this.parcelasVencer = [];
      this.parcelasVencidas = [];
      this.ausenciasLongas = [];

      // Forçar detecção de mudanças novamente
      this.cdr.detectChanges();

      // Tentar carregar dados novamente com um atraso para melhor feedback visual
      setTimeout(() => {
        this.carregarDados();
      }, 800);
    }, 200);
  }
}
