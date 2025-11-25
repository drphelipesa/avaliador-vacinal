import React, { useState, useEffect } from 'react';
import {
  Syringe,
  Baby,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Shield,
  Calendar,
  Info,
  Target,
  X
} from 'lucide-react';

// Calendário Nacional de Vacinação - Ministério da Saúde (Atualizado 2024/2025)
const vacinas = [
  { id: 'bcg', nome: 'BCG', idade: 0, protecao: 'Formas graves de tuberculose (meníngea e miliar)', categoria: 'essencial', doses: 1 },
  { id: 'hepb', nome: 'Hepatite B', idade: 0, protecao: 'Hepatite B', categoria: 'essencial', doses: 1 },
  { id: 'penta1', nome: 'Pentavalente (1ª dose)', idade: 2, protecao: 'Difteria, tétano, coqueluche, hepatite B e Haemophilus influenzae tipo b', categoria: 'essencial', doses: 1 },
  { id: 'vip1', nome: 'VIP - Poliomielite (1ª dose)', idade: 2, protecao: 'Poliomielite (paralisia infantil)', categoria: 'essencial', doses: 1 },
  { id: 'pneumo1', nome: 'Pneumocócica 10-valente (1ª dose)', idade: 2, protecao: 'Pneumonia, meningite, otite e sepse', categoria: 'essencial', doses: 1 },
  { id: 'rota1', nome: 'Rotavírus (1ª dose)', idade: 2, protecao: 'Diarreia por rotavírus', categoria: 'essencial', doses: 1 },
  { id: 'meningo1', nome: 'Meningocócica C (1ª dose)', idade: 3, protecao: 'Meningite e meningococcemia', categoria: 'essencial', doses: 1 },
  { id: 'penta2', nome: 'Pentavalente (2ª dose)', idade: 4, protecao: 'Difteria, tétano, coqueluche, hepatite B e Haemophilus influenzae tipo b', categoria: 'essencial', doses: 1 },
  { id: 'vip2', nome: 'VIP - Poliomielite (2ª dose)', idade: 4, protecao: 'Poliomielite (paralisia infantil)', categoria: 'essencial', doses: 1 },
  { id: 'pneumo2', nome: 'Pneumocócica 10-valente (2ª dose)', idade: 4, protecao: 'Pneumonia, meningite, otite e sepse', categoria: 'essencial', doses: 1 },
  { id: 'rota2', nome: 'Rotavírus (2ª dose)', idade: 4, protecao: 'Diarreia por rotavírus', categoria: 'essencial', doses: 1 },
  { id: 'meningo2', nome: 'Meningocócica C (2ª dose)', idade: 5, protecao: 'Meningite e meningococcemia', categoria: 'essencial', doses: 1 },
  { id: 'penta3', nome: 'Pentavalente (3ª dose)', idade: 6, protecao: 'Difteria, tétano, coqueluche, hepatite B e Haemophilus influenzae tipo b', categoria: 'essencial', doses: 1 },
  { id: 'vip3', nome: 'VIP - Poliomielite (3ª dose)', idade: 6, protecao: 'Poliomielite (paralisia infantil)', categoria: 'essencial', doses: 1 },
  { id: 'febre', nome: 'Febre Amarela', idade: 9, protecao: 'Febre amarela', categoria: 'essencial', doses: 1 },
  { id: 'triplice', nome: 'Tríplice Viral (SCR - 1ª dose)', idade: 12, protecao: 'Sarampo, caxumba e rubéola', categoria: 'essencial', doses: 1 },
  { id: 'pneumo3', nome: 'Pneumocócica 10-valente (reforço)', idade: 12, protecao: 'Pneumonia, meningite, otite e sepse', categoria: 'reforco', doses: 1 },
  { id: 'meningo3', nome: 'Meningocócica C (reforço)', idade: 12, protecao: 'Meningite e meningococcemia', categoria: 'reforco', doses: 1 },
  { id: 'dtp1', nome: 'DTP (1º reforço)', idade: 15, protecao: 'Difteria, tétano e coqueluche', categoria: 'reforco', doses: 1 },
  { id: 'vop1', nome: 'VOP (1º reforço)', idade: 15, protecao: 'Poliomielite (paralisia infantil)', categoria: 'reforco', doses: 1 },
  { id: 'hepa', nome: 'Hepatite A', idade: 15, protecao: 'Hepatite A', categoria: 'essencial', doses: 1 },
  { id: 'tetra', nome: 'Tetraviral (SCRV)', idade: 15, protecao: 'Sarampo, caxumba, rubéola e varicela (catapora)', categoria: 'essencial', doses: 1 },
  { id: 'dtp2', nome: 'DTP (2º reforço)', idade: 48, protecao: 'Difteria, tétano e coqueluche', categoria: 'reforco', doses: 1 },
  { id: 'vop2', nome: 'VOP (2º reforço)', idade: 48, protecao: 'Poliomielite (paralisia infantil)', categoria: 'reforco', doses: 1 },
  { id: 'varicela', nome: 'Varicela (2ª dose)', idade: 48, protecao: 'Varicela (catapora)', categoria: 'essencial', doses: 1 },
  { id: 'hpv', nome: 'HPV (2 doses)', idade: 108, protecao: 'Infecção por HPV, câncer de colo do útero, vulva, vagina, pênis, ânus e orofaringe', categoria: 'essencial', doses: 2 },
];

function App() {
  const [nomeCrianca, setNomeCrianca] = useState('');
  const [idadeMeses, setIdadeMeses] = useState('');
  const [vacinasTomadas, setVacinasTomadas] = useState([]);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('avaliadorVacinal');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      setNomeCrianca(dados.nomeCrianca || '');
      setIdadeMeses(dados.idadeMeses || '');
      setVacinasTomadas(dados.vacinasTomadas || []);
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    const dados = { nomeCrianca, idadeMeses, vacinasTomadas };
    localStorage.setItem('avaliadorVacinal', JSON.stringify(dados));
  }, [nomeCrianca, idadeMeses, vacinasTomadas]);

  const handleVacinaTomada = (id) => {
    setVacinasTomadas(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const limparTudo = () => {
    if (window.confirm('Deseja limpar todos os dados?')) {
      setNomeCrianca('');
      setIdadeMeses('');
      setVacinasTomadas([]);
      localStorage.removeItem('avaliadorVacinal');
    }
  };

  const imprimirCarteira = () => window.print();

  const exportarDados = () => {
    const dados = {
      nomeCrianca: nomeCrianca || 'Não informado',
      idadeMeses: idadeMeses || 0,
      dataAvaliacao: new Date().toLocaleDateString('pt-BR'),
      vacinasAplicadas: vacinas.filter(v => vacinasTomadas.includes(v.id)).map(v => v.nome),
      vacinasPendentes: getVacinasPendentes().map(v => v.nome)
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carteira-${nomeCrianca || 'vacinal'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatarIdade = (idade) => {
    if (idade === 0) return "Ao nascer";
    if (idade < 12) return `${idade} ${idade === 1 ? 'mês' : 'meses'}`;
    if (idade === 12) return "1 ano";
    if (idade % 12 === 0) return `${idade / 12} anos`;
    return `${Math.floor(idade / 12)} ano${Math.floor(idade / 12) > 1 ? 's' : ''} e ${idade % 12} ${idade % 12 === 1 ? 'mês' : 'meses'}`;
  };

  const getVacinasPendentes = () => {
    const idadeMesesNum = parseInt(idadeMeses) || 0;
    return vacinas.filter(v => v.idade <= idadeMesesNum && !vacinasTomadas.includes(v.id));
  };

  const getProximasVacinas = () => {
    const idadeMesesNum = parseInt(idadeMeses) || 0;
    return vacinas.filter(v => v.idade > idadeMesesNum).slice(0, 3);
  };

  const calcularProgresso = () => {
    const idadeMesesNum = parseInt(idadeMeses) || 0;
    const vacinasDevidas = vacinas.filter(v => v.idade <= idadeMesesNum);
    const vacinasRealizadas = vacinasDevidas.filter(v => vacinasTomadas.includes(v.id));
    return vacinasDevidas.length > 0 ? Math.round((vacinasRealizadas.length / vacinasDevidas.length) * 100) : 0;
  };

  const agruparVacinasPorIdade = () => {
    const grupos = {};
    vacinas.forEach(vacina => {
      if (!grupos[vacina.idade]) grupos[vacina.idade] = [];
      grupos[vacina.idade].push(vacina);
    });
    return Object.entries(grupos).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  };

  const idadeMesesNum = parseInt(idadeMeses) || 0;
  const vacinasPendentes = getVacinasPendentes();
  const proximasVacinas = getProximasVacinas();
  const progresso = calcularProgresso();
  const totalVacinas = vacinas.filter(v => v.idade <= idadeMesesNum).length;
  const totalAplicadas = vacinasTomadas.filter(id => {
    const vacina = vacinas.find(v => v.id === id);
    return vacina && vacina.idade <= idadeMesesNum;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header Fixo */}
      <header className="bg-white shadow-sm border-b border-indigo-100 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-2 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Carteira de Vacinação Digital</h1>
                <p className="text-xs text-gray-500">Ministério da Saúde • 2024/2025</p>
              </div>
            </div>
            <button
              onClick={() => setMostrarAjuda(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Card de Informações Básicas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Baby className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Informações da Criança</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <input
                type="text"
                value={nomeCrianca}
                onChange={(e) => setNomeCrianca(e.target.value)}
                placeholder="Digite o nome da criança"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Idade em Meses</label>
              <input
                type="number"
                value={idadeMeses}
                onChange={(e) => setIdadeMeses(e.target.value)}
                placeholder="Ex: 18"
                min="0"
                max="216"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
              />
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={imprimirCarteira}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span className="font-medium">Imprimir</span>
            </button>
            <button
              onClick={exportarDados}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Exportar</span>
            </button>
            <button
              onClick={limparTudo}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition ml-auto"
            >
              <X className="w-4 h-4" />
              <span className="font-medium">Limpar Tudo</span>
            </button>
          </div>
        </div>

        {/* Dashboard de Status */}
        {idadeMeses && (
          <div className="grid md:grid-cols-3 gap-4">
            {/* Progresso Geral */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{progresso}%</span>
              </div>
              <h3 className="font-semibold mb-1">Progresso Geral</h3>
              <p className="text-sm opacity-90">{totalAplicadas} de {totalVacinas} vacinas aplicadas</p>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            {/* Vacinas Pendentes */}
            <div className={`rounded-2xl p-6 ${vacinasPendentes.length > 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'} text-white`}>
              <div className="flex items-center justify-between mb-4">
                {vacinasPendentes.length > 0 ? (
                  <AlertCircle className="w-8 h-8" />
                ) : (
                  <CheckCircle2 className="w-8 h-8" />
                )}
                <span className="text-3xl font-bold">{vacinasPendentes.length}</span>
              </div>
              <h3 className="font-semibold mb-1">
                {vacinasPendentes.length > 0 ? 'Vacinas Atrasadas' : 'Tudo em Dia!'}
              </h3>
              <p className="text-sm opacity-90">
                {vacinasPendentes.length > 0
                  ? 'Procure uma unidade de saúde'
                  : 'Parabéns, continue assim!'}
              </p>
            </div>

            {/* Próximas Vacinas */}
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{proximasVacinas.length}</span>
              </div>
              <h3 className="font-semibold mb-1">Próximas Vacinas</h3>
              <p className="text-sm opacity-90">
                {proximasVacinas.length > 0
                  ? `A partir de ${formatarIdade(proximasVacinas[0].idade)}`
                  : 'Calendário completo'}
              </p>
            </div>
          </div>
        )}

        {/* Alertas Importantes */}
        {idadeMeses && vacinasPendentes.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">Atenção! Vacinas em Atraso</h3>
                <div className="space-y-2">
                  {vacinasPendentes.slice(0, 5).map((vacina) => (
                    <div key={vacina.id} className="flex items-start gap-2 text-sm">
                      <Syringe className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-red-800">
                        <strong>{vacina.nome}</strong> - Indicada aos {formatarIdade(vacina.idade)}
                      </span>
                    </div>
                  ))}
                  {vacinasPendentes.length > 5 && (
                    <p className="text-sm text-red-700 italic">+ {vacinasPendentes.length - 5} vacina(s) pendente(s)</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendário de Vacinas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Calendário Completo de Vacinação</h2>
          </div>

          <div className="space-y-6">
            {agruparVacinasPorIdade().map(([idade, vacinasGrupo]) => {
              const idadeNum = parseInt(idade);
              const isPast = idadeMesesNum >= idadeNum;

              return (
                <div key={idade} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
                      isPast ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {formatarIdade(idadeNum)}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {vacinasGrupo.map((vacina) => {
                      const isAplicada = vacinasTomadas.includes(vacina.id);
                      const isAtrasada = !isAplicada && vacina.idade <= idadeMesesNum;
                      const isFutura = vacina.idade > idadeMesesNum;

                      return (
                        <div
                          key={vacina.id}
                          className={`group relative border-2 rounded-xl p-4 transition-all cursor-pointer ${
                            isAplicada
                              ? 'bg-green-50 border-green-300 hover:shadow-md'
                              : isAtrasada
                              ? 'bg-red-50 border-red-300 hover:shadow-md'
                              : 'bg-gray-50 border-gray-200 hover:border-indigo-300 hover:shadow-md'
                          }`}
                          onClick={() => handleVacinaTomada(vacina.id)}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox customizado */}
                            <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isAplicada
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 group-hover:border-indigo-500'
                            }`}>
                              {isAplicada && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h4 className="font-bold text-gray-900 mb-1">{vacina.nome}</h4>
                                  <p className="text-sm text-gray-600">{vacina.protecao}</p>
                                </div>

                                {/* Status Badge */}
                                <div className="flex-shrink-0">
                                  {isAplicada && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Aplicada
                                    </span>
                                  )}
                                  {isAtrasada && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                      <AlertCircle className="w-3 h-3" />
                                      Atrasada
                                    </span>
                                  )}
                                  {isFutura && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                      <Clock className="w-3 h-3" />
                                      Futura
                                    </span>
                                  )}
                                </div>
                              </div>

                              {vacina.categoria === 'reforco' && (
                                <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                  Reforço
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé Informativo */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 print:hidden">
          <div className="flex gap-4">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-bold text-amber-900">Informações Importantes</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Clique nas vacinas para marcá-las como aplicadas</li>
                <li>• Seus dados são salvos automaticamente no navegador</li>
                <li>• Consulte sempre um profissional de saúde para orientações</li>
                <li>• Vacinas atrasadas podem ser aplicadas a qualquer momento</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Ajuda */}
      {mostrarAjuda && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 print:hidden">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Como Usar</h3>
              <button
                onClick={() => setMostrarAjuda(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-1">1. Preencha os dados</h4>
                <p className="text-gray-600">Informe o nome e a idade da criança em meses</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">2. Marque as vacinas aplicadas</h4>
                <p className="text-gray-600">Clique nas vacinas que já foram tomadas</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">3. Acompanhe o progresso</h4>
                <p className="text-gray-600">Veja o percentual de vacinação e vacinas pendentes</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">4. Imprima ou exporte</h4>
                <p className="text-gray-600">Leve a carteira digital para consultas médicas</p>
              </div>
            </div>
            <button
              onClick={() => setMostrarAjuda(false)}
              className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
