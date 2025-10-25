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
  Info
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
  const [idadeAnos, setIdadeAnos] = useState('');
  const [vacinasTomadas, setVacinasTomadas] = useState([]);
  const [vacinasFaltantes, setVacinasFaltantes] = useState([]);
  const [proximasVacinas, setProximasVacinas] = useState([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [filtroVisao, setFiltroVisao] = useState('todas'); // todas, pendentes, futuras

  // Carregar dados do localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('avaliadorVacinal');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      setNomeCrianca(dados.nomeCrianca || '');
      setIdadeMeses(dados.idadeMeses || '');
      setIdadeAnos(dados.idadeAnos || '');
      setVacinasTomadas(dados.vacinasTomadas || []);
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    const dados = {
      nomeCrianca,
      idadeMeses,
      idadeAnos,
      vacinasTomadas
    };
    localStorage.setItem('avaliadorVacinal', JSON.stringify(dados));
  }, [nomeCrianca, idadeMeses, idadeAnos, vacinasTomadas]);

  useEffect(() => {
    if (idadeAnos !== '') {
      setIdadeMeses(Math.floor(parseFloat(idadeAnos) * 12).toString());
    }
  }, [idadeAnos]);

  const handleIdadeMesesChange = (e) => {
    setIdadeMeses(e.target.value);
    setIdadeAnos('');
    setMostrarResultado(false);
  };

  const handleIdadeAnosChange = (e) => {
    setIdadeAnos(e.target.value);
    setMostrarResultado(false);
  };

  const handleVacinaTomada = (id) => {
    setVacinasTomadas(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const avaliarVacinas = () => {
    if (!idadeMeses) {
      alert('Por favor, informe a idade da criança.');
      return;
    }
    const idadeMesesNum = parseInt(idadeMeses);
    const faltantes = vacinas
      .filter(v => v.idade <= idadeMesesNum && !vacinasTomadas.includes(v.id));
    const proximas = vacinas
      .filter(v => v.idade > idadeMesesNum)
      .slice(0, 5);

    setVacinasFaltantes(faltantes);
    setProximasVacinas(proximas);
    setMostrarResultado(true);
  };

  const limparFormulario = () => {
    if (window.confirm('Deseja realmente limpar todos os dados? Esta ação não pode ser desfeita.')) {
      setNomeCrianca('');
      setIdadeMeses('');
      setIdadeAnos('');
      setVacinasTomadas([]);
      setVacinasFaltantes([]);
      setProximasVacinas([]);
      setMostrarResultado(false);
      localStorage.removeItem('avaliadorVacinal');
    }
  };

  const imprimirCarteira = () => {
    window.print();
  };

  const exportarDados = () => {
    const idadeMesesNum = parseInt(idadeMeses) || 0;
    const dados = {
      nomeCrianca: nomeCrianca || 'Não informado',
      idade: formatarIdade(idadeMesesNum),
      dataAvaliacao: new Date().toLocaleDateString('pt-BR'),
      vacinasAplicadas: vacinas
        .filter(v => vacinasTomadas.includes(v.id))
        .map(v => ({ nome: v.nome, idade: formatarIdade(v.idade) })),
      vacinasPendentes: vacinasFaltantes.map(v => ({ nome: v.nome, idade: formatarIdade(v.idade) })),
      proximasVacinas: proximasVacinas.map(v => ({ nome: v.nome, idade: formatarIdade(v.idade) }))
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carteira-vacinal-${nomeCrianca || 'crianca'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatarIdade = (idade) => {
    if (idade === 0) return "Ao nascer";
    if (idade < 12) return `${idade} meses`;
    if (idade === 12) return "1 ano";
    if (idade % 12 === 0) return `${idade / 12} anos`;
    return `${Math.floor(idade / 12)} anos e ${idade % 12} meses`;
  };

  const agruparVacinasPorMes = () => {
    const grupos = {};
    const idadeMesesNum = parseInt(idadeMeses) || 0;

    vacinas.forEach(vacina => {
      // Aplicar filtro
      if (filtroVisao === 'pendentes' && (vacina.idade > idadeMesesNum || vacinasTomadas.includes(vacina.id))) {
        return;
      }
      if (filtroVisao === 'futuras' && vacina.idade <= idadeMesesNum) {
        return;
      }

      const chave = vacina.idade;
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(vacina);
    });
    return Object.entries(grupos).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  };

  const calcularProgresso = () => {
    const idadeMesesNum = parseInt(idadeMeses) || 0;
    const vacinasDevidas = vacinas.filter(v => v.idade <= idadeMesesNum);
    const vacinasRealizadas = vacinasDevidas.filter(v => vacinasTomadas.includes(v.id));
    return vacinasDevidas.length > 0 ? Math.round((vacinasRealizadas.length / vacinasDevidas.length) * 100) : 0;
  };

  const getStatusVacina = (vacina) => {
    const idadeMesesNum = parseInt(idadeMeses) || 0;
    const tomada = vacinasTomadas.includes(vacina.id);

    if (tomada) return { status: 'aplicada', cor: 'bg-green-50 border-green-300', texto: 'text-green-700' };
    if (vacina.idade <= idadeMesesNum) return { status: 'atrasada', cor: 'bg-red-50 border-red-300', texto: 'text-red-700' };
    return { status: 'futura', cor: 'bg-blue-50 border-blue-300', texto: 'text-blue-700' };
  };

  const progresso = calcularProgresso();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-4 px-2 sm:py-8 sm:px-4">
      {/* Cabeçalho */}
      <div className="max-w-6xl mx-auto mb-6 print:hidden">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-center mb-3">
            <Shield className="w-10 h-10 mr-3" />
            <h1 className="text-3xl font-bold">Avaliador de Calendário Vacinal</h1>
          </div>
          <p className="text-center text-blue-100 text-sm">
            Conforme o Calendário Nacional de Vacinação - Ministério da Saúde (2024/2025)
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Card de informações da criança */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 print:shadow-none">
          <div className="flex items-center mb-4">
            <Baby className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Informações da Criança</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nome da Criança</label>
              <input
                type="text"
                value={nomeCrianca}
                onChange={(e) => setNomeCrianca(e.target.value)}
                placeholder="Nome completo"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Idade em Meses</label>
              <input
                type="number"
                value={idadeMeses}
                onChange={handleIdadeMesesChange}
                placeholder="Ex: 18"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">ou Idade em Anos</label>
              <input
                type="number"
                value={idadeAnos}
                onChange={handleIdadeAnosChange}
                placeholder="Ex: 1.5"
                step="0.1"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Barra de progresso */}
          {idadeMeses && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Progresso da Vacinação</span>
                <span className="text-sm font-bold text-blue-600">{progresso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 flex items-center justify-end"
                  style={{ width: `${progresso}%` }}
                >
                  {progresso > 10 && <CheckCircle2 className="w-4 h-4 text-white mr-1" />}
                </div>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex flex-wrap gap-3 mt-6 print:hidden">
            <button
              onClick={avaliarVacinas}
              className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold flex items-center justify-center shadow-md"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Avaliar Calendário
            </button>
            <button
              onClick={imprimirCarteira}
              disabled={!idadeMeses}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="w-5 h-5 mr-2" />
              Imprimir
            </button>
            <button
              onClick={exportarDados}
              disabled={!idadeMeses}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-semibold flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              Exportar
            </button>
            <button
              onClick={limparFormulario}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition font-semibold shadow-md"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Resultados da avaliação */}
        {mostrarResultado && (
          <div className="grid md:grid-cols-2 gap-6 mb-6 print:grid-cols-1">
            {/* Vacinas atrasadas */}
            {vacinasFaltantes.length > 0 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 mr-2 text-red-600" />
                  <h3 className="text-xl font-bold text-red-700">Vacinas Atrasadas</h3>
                </div>
                <p className="text-sm text-red-600 mb-4">
                  Estas vacinas deveriam ter sido aplicadas. Procure uma unidade de saúde!
                </p>
                <ul className="space-y-2">
                  {vacinasFaltantes.map((vacina, index) => (
                    <li key={index} className="flex items-start p-3 bg-white rounded-lg">
                      <Syringe className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">{vacina.nome}</p>
                        <p className="text-xs text-gray-600">{vacina.protecao}</p>
                        <p className="text-xs text-red-600 mt-1">Indicada aos {formatarIdade(vacina.idade)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Próximas vacinas */}
            {proximasVacinas.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 mr-2 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-700">Próximas Vacinas</h3>
                </div>
                <p className="text-sm text-blue-600 mb-4">
                  Prepare-se! Estas vacinas serão necessárias em breve.
                </p>
                <ul className="space-y-2">
                  {proximasVacinas.map((vacina, index) => (
                    <li key={index} className="flex items-start p-3 bg-white rounded-lg">
                      <Calendar className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">{vacina.nome}</p>
                        <p className="text-xs text-gray-600">{vacina.protecao}</p>
                        <p className="text-xs text-blue-600 mt-1">Indicada aos {formatarIdade(vacina.idade)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tudo em dia */}
            {vacinasFaltantes.length === 0 && idadeMeses && (
              <div className="bg-green-50 border-2 border-green-300 rounded-xl shadow-lg p-6 md:col-span-2">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 mr-3 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-700">Parabéns! Vacinação em dia!</h3>
                </div>
                <p className="text-center text-green-600">
                  Todas as vacinas indicadas para a idade foram aplicadas. Continue acompanhando o calendário!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 print:hidden">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center">
              <Info className="w-5 h-5 mr-2 text-gray-600" />
              <span className="font-semibold text-gray-700">Visualização:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroVisao('todas')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filtroVisao === 'todas'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltroVisao('pendentes')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filtroVisao === 'pendentes'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pendentes
              </button>
              <button
                onClick={() => setFiltroVisao('futuras')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filtroVisao === 'futuras'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Futuras
              </button>
            </div>
          </div>
        </div>

        {/* Lista de vacinas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Syringe className="w-6 h-6 mr-2 text-blue-600" />
            Calendário de Vacinação Completo
          </h2>

          <div className="space-y-4">
            {agruparVacinasPorMes().map(([idade, vacinasGrupo]) => (
              <div key={idade} className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center mb-3 pb-2 border-b-2 border-gray-200">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-bold text-blue-700">{formatarIdade(parseInt(idade))}</h3>
                </div>
                <div className="space-y-3">
                  {vacinasGrupo.map((vacina) => {
                    const status = getStatusVacina(vacina);
                    const tomada = vacinasTomadas.includes(vacina.id);

                    return (
                      <div
                        key={vacina.id}
                        className={`border-2 rounded-lg p-4 transition-all ${status.cor} ${
                          tomada ? 'opacity-75' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id={vacina.id}
                            checked={tomada}
                            onChange={() => handleVacinaTomada(vacina.id)}
                            className="mt-1 mr-3 w-5 h-5 cursor-pointer print:hidden"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <label
                                htmlFor={vacina.id}
                                className={`font-bold text-base cursor-pointer ${status.texto}`}
                              >
                                {vacina.nome}
                              </label>
                              {tomada && (
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{vacina.protecao}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                  status.status === 'aplicada'
                                    ? 'bg-green-200 text-green-800'
                                    : status.status === 'atrasada'
                                    ? 'bg-red-200 text-red-800'
                                    : 'bg-blue-200 text-blue-800'
                                }`}
                              >
                                {status.status === 'aplicada'
                                  ? 'Aplicada'
                                  : status.status === 'atrasada'
                                  ? 'Atrasada'
                                  : 'Futura'}
                              </span>
                              {vacina.categoria === 'reforco' && (
                                <span className="text-xs px-3 py-1 rounded-full font-semibold bg-purple-200 text-purple-800">
                                  Reforço
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé informativo */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 print:hidden">
          <div className="flex items-start">
            <Info className="w-6 h-6 mr-3 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-yellow-800 mb-2">Informações Importantes</h4>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                <li>Este avaliador segue o Calendário Nacional de Vacinação do Ministério da Saúde</li>
                <li>Sempre consulte um profissional de saúde para orientações personalizadas</li>
                <li>Mantenha a caderneta de vacinação sempre atualizada</li>
                <li>Vacinas atrasadas podem ser aplicadas a qualquer momento</li>
                <li>Seus dados são salvos automaticamente no navegador</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;