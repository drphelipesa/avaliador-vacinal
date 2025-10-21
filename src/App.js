import React, { useState, useEffect } from 'react';

// Calendário Nacional de Vacinação 2025 - Atualizado conforme Ministério da Saúde
const vacinas = [
  { id: 'bcg', nome: 'BCG', idade: 0, protecao: 'formas graves de tuberculose', dose: 'Dose única' },
  { id: 'hepb', nome: 'Hepatite B', idade: 0, protecao: 'hepatite B', dose: 'Ao nascer' },
  { id: 'vip1', nome: 'VIP (1ª dose)', idade: 2, protecao: 'poliomielite', dose: '1ª dose' },
  { id: 'rota1', nome: 'Rotavírus (1ª dose)', idade: 2, protecao: 'diarreia por rotavírus', dose: '1ª dose' },
  { id: 'penta1', nome: 'Pentavalente (1ª dose)', idade: 2, protecao: 'difteria, tétano, coqueluche, hepatite B e Haemophilus influenzae tipo b', dose: '1ª dose' },
  { id: 'pneumo1', nome: 'Pneumocócica 10-valente (1ª dose)', idade: 2, protecao: 'pneumonia, meningite e otite', dose: '1ª dose' },
  { id: 'meningo1', nome: 'Meningocócica C (1ª dose)', idade: 3, protecao: 'meningite e meningococcemia', dose: '1ª dose' },
  { id: 'vip2', nome: 'VIP (2ª dose)', idade: 4, protecao: 'poliomielite', dose: '2ª dose' },
  { id: 'rota2', nome: 'Rotavírus (2ª dose)', idade: 4, protecao: 'diarreia por rotavírus', dose: '2ª dose' },
  { id: 'penta2', nome: 'Pentavalente (2ª dose)', idade: 4, protecao: 'difteria, tétano, coqueluche, hepatite B e Haemophilus influenzae tipo b', dose: '2ª dose' },
  { id: 'pneumo2', nome: 'Pneumocócica 10-valente (2ª dose)', idade: 4, protecao: 'pneumonia, meningite e otite', dose: '2ª dose' },
  { id: 'meningo2', nome: 'Meningocócica C (2ª dose)', idade: 5, protecao: 'meningite e meningococcemia', dose: '2ª dose' },
  { id: 'vip3', nome: 'VIP (3ª dose)', idade: 6, protecao: 'poliomielite', dose: '3ª dose' },
  { id: 'penta3', nome: 'Pentavalente (3ª dose)', idade: 6, protecao: 'difteria, tétano, coqueluche, hepatite B e Haemophilus influenzae tipo b', dose: '3ª dose' },
  { id: 'covid1', nome: 'COVID-19 (1ª dose)', idade: 6, protecao: 'COVID-19', dose: '1ª dose' },
  { id: 'influenza1', nome: 'Influenza (Gripe)', idade: 6, protecao: 'influenza (gripe)', dose: 'Dose anual' },
  { id: 'covid2', nome: 'COVID-19 (2ª dose)', idade: 7, protecao: 'COVID-19', dose: '2ª dose (intervalo de 4 semanas)' },
  { id: 'febre', nome: 'Febre Amarela (1ª dose)', idade: 9, protecao: 'febre amarela', dose: '1ª dose' },
  { id: 'triplice', nome: 'Tríplice Viral (1ª dose)', idade: 12, protecao: 'sarampo, caxumba e rubéola', dose: '1ª dose' },
  { id: 'pneumo3', nome: 'Pneumocócica 10-valente (reforço)', idade: 12, protecao: 'pneumonia, meningite e otite', dose: 'Reforço' },
  { id: 'meningo3', nome: 'Meningocócica C (reforço)', idade: 12, protecao: 'meningite e meningococcemia', dose: 'Reforço' },
  { id: 'vip4', nome: 'VIP (reforço)', idade: 15, protecao: 'poliomielite', dose: 'Reforço único' },
  { id: 'dtp1', nome: 'DTP (1º reforço)', idade: 15, protecao: 'difteria, tétano e coqueluche', dose: '1º reforço' },
  { id: 'hepa', nome: 'Hepatite A', idade: 15, protecao: 'hepatite A', dose: 'Dose única' },
  { id: 'tetra', nome: 'Tetraviral (SCRV)', idade: 15, protecao: 'sarampo, caxumba, rubéola e varicela', dose: 'Dose única' },
  { id: 'dtp2', nome: 'DTP (2º reforço)', idade: 48, protecao: 'difteria, tétano e coqueluche', dose: '2º reforço' },
  { id: 'febre2', nome: 'Febre Amarela (reforço)', idade: 48, protecao: 'febre amarela', dose: 'Reforço (4 anos)' },
  { id: 'hpv', nome: 'HPV (Papilomavírus Humano)', idade: 108, protecao: 'infecção por HPV, verrugas genitais e cânceres relacionados ao HPV', dose: 'Dose única (9 a 14 anos)' },
];

function App() {
  const [idadeMeses, setIdadeMeses] = useState('');
  const [idadeAnos, setIdadeAnos] = useState('');
  const [nomeCrianca, setNomeCrianca] = useState('');
  const [vacinasTomadas, setVacinasTomadas] = useState([]);
  const [vacinasFaltantes, setVacinasFaltantes] = useState([]);
  const [proximasVacinas, setProximasVacinas] = useState([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [erro, setErro] = useState('');
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(false);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('avaliacaoVacinal');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      setNomeCrianca(dados.nomeCrianca || '');
      setIdadeMeses(dados.idadeMeses || '');
      setVacinasTomadas(dados.vacinasTomadas || []);
    }
  }, []);

  // Salvar dados no localStorage sempre que mudarem
  useEffect(() => {
    if (nomeCrianca || idadeMeses || vacinasTomadas.length > 0) {
      localStorage.setItem('avaliacaoVacinal', JSON.stringify({
        nomeCrianca,
        idadeMeses,
        vacinasTomadas
      }));
    }
  }, [nomeCrianca, idadeMeses, vacinasTomadas]);

  useEffect(() => {
    if (idadeAnos !== '') {
      const anos = parseFloat(idadeAnos);
      if (anos >= 0 && anos <= 15) {
        setIdadeMeses(Math.floor(anos * 12).toString());
        setErro('');
      }
    }
  }, [idadeAnos]);

  const handleIdadeMesesChange = (e) => {
    const valor = e.target.value;
    if (valor === '' || (parseInt(valor) >= 0 && parseInt(valor) <= 180)) {
      setIdadeMeses(valor);
      setIdadeAnos('');
      setMostrarResultado(false);
      setErro('');
    }
  };

  const handleIdadeAnosChange = (e) => {
    const valor = e.target.value;
    if (valor === '' || (parseFloat(valor) >= 0 && parseFloat(valor) <= 15)) {
      setIdadeAnos(valor);
      setMostrarResultado(false);
      setErro('');
    }
  };

  const handleVacinaTomada = (id) => {
    setVacinasTomadas(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
    setMostrarResultado(false);
  };

  const calcularEstatisticas = () => {
    const idadeMesesNum = parseInt(idadeMeses) || 0;
    const vacinasEsperadas = vacinas.filter(v => v.idade <= idadeMesesNum);
    const vacinasTomadaCount = vacinasEsperadas.filter(v => vacinasTomadas.includes(v.id)).length;
    const percentual = vacinasEsperadas.length > 0
      ? Math.round((vacinasTomadaCount / vacinasEsperadas.length) * 100)
      : 0;

    return {
      total: vacinasEsperadas.length,
      tomadas: vacinasTomadaCount,
      faltantes: vacinasEsperadas.length - vacinasTomadaCount,
      percentual
    };
  };

  const avaliarVacinas = () => {
    if (!idadeMeses || parseInt(idadeMeses) < 0) {
      setErro('Por favor, informe a idade da criança.');
      return;
    }

    const idadeMesesNum = parseInt(idadeMeses);
    const faltantes = vacinas
      .filter(v => v.idade <= idadeMesesNum && !vacinasTomadas.includes(v.id))
      .map(v => ({ nome: v.nome, protecao: v.protecao, idade: v.idade }));

    const proximas = vacinas
      .filter(v => v.idade > idadeMesesNum)
      .slice(0, 5)
      .map(v => ({
        nome: v.nome,
        idade: formatarIdade(v.idade),
        protecao: v.protecao,
        idadeMeses: v.idade
      }));

    setVacinasFaltantes(faltantes);
    setProximasVacinas(proximas);
    setMostrarResultado(true);
    setMostrarEstatisticas(true);
    setErro('');
  };

  const limparFormulario = () => {
    setIdadeMeses('');
    setIdadeAnos('');
    setNomeCrianca('');
    setVacinasTomadas([]);
    setVacinasFaltantes([]);
    setProximasVacinas([]);
    setMostrarResultado(false);
    setMostrarEstatisticas(false);
    setErro('');
    localStorage.removeItem('avaliacaoVacinal');
  };

  const formatarIdade = (idade) => {
    if (idade === 0) return "Ao nascer";
    if (idade < 12) return `${idade} ${idade === 1 ? 'mês' : 'meses'}`;
    if (idade === 12) return "1 ano";
    if (idade % 12 === 0) return `${idade / 12} anos`;
    return `${Math.floor(idade / 12)} anos e ${idade % 12} ${(idade % 12) === 1 ? 'mês' : 'meses'}`;
  };

  const agruparVacinasPorMes = () => {
    const grupos = {};
    vacinas.forEach(vacina => {
      const chave = vacina.idade;
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(vacina);
    });
    return Object.entries(grupos).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  };

  const stats = calcularEstatisticas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Avaliador de Calendário Vacinal Infantil
          </h1>
          <p className="text-lg text-gray-600">Calendário Nacional de Vacinação 2025 - Ministério da Saúde</p>
        </div>

        {/* Card de Informações da Criança */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Informações da Criança</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nome (opcional)</label>
              <input
                type="text"
                value={nomeCrianca}
                onChange={(e) => setNomeCrianca(e.target.value)}
                placeholder="Nome da criança"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Idade em Meses</label>
              <input
                type="number"
                value={idadeMeses}
                onChange={handleIdadeMesesChange}
                placeholder="Ex: 6"
                min="0"
                max="180"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Ou em Anos</label>
              <input
                type="number"
                value={idadeAnos}
                onChange={handleIdadeAnosChange}
                placeholder="Ex: 2"
                min="0"
                max="15"
                step="0.1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {erro && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
              <p className="font-bold">Atenção!</p>
              <p>{erro}</p>
            </div>
          )}
        </div>

        {/* Dashboard de Estatísticas */}
        {mostrarEstatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="text-sm font-medium text-gray-600 mb-1">Cobertura Vacinal</div>
              <div className="text-3xl font-bold text-blue-600">{stats.percentual}%</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="text-sm font-medium text-gray-600 mb-1">Vacinas Aplicadas</div>
              <div className="text-3xl font-bold text-green-600">{stats.tomadas}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="text-sm font-medium text-gray-600 mb-1">Vacinas Atrasadas</div>
              <div className="text-3xl font-bold text-red-600">{stats.faltantes}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="text-sm font-medium text-gray-600 mb-1">Total Esperado</div>
              <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
            </div>
          </div>
        )}

        {/* Calendário de Vacinas */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Calendário de Vacinas</h2>
          <p className="text-sm text-gray-600 mb-4">Marque as vacinas que a criança já recebeu</p>

          <div className="space-y-4">
            {agruparVacinasPorMes().map(([idade, vacinasGrupo]) => (
              <div key={idade} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                    {formatarIdade(parseInt(idade))}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vacinasGrupo.map(vacina => (
                    <div key={vacina.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        id={vacina.id}
                        checked={vacinasTomadas.includes(vacina.id)}
                        onChange={() => handleVacinaTomada(vacina.id)}
                        className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor={vacina.id} className="flex-1 cursor-pointer">
                        <div className="font-semibold text-gray-900">{vacina.nome}</div>
                        <div className="text-sm text-gray-600 italic">{vacina.protecao}</div>
                        {vacina.dose && <div className="text-xs text-blue-600 mt-1">{vacina.dose}</div>}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={avaliarVacinas}
            className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Avaliar Calendário Vacinal
          </button>
          <button
            onClick={limparFormulario}
            className="sm:w-auto bg-gray-600 text-white py-4 px-6 rounded-xl hover:bg-gray-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            Limpar Dados
          </button>
        </div>

        {/* Resultados */}
        {mostrarResultado && (
          <div className="space-y-6">
            {vacinasFaltantes.length > 0 ? (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="ml-3 text-xl font-bold text-red-800">Vacinas Atrasadas ({vacinasFaltantes.length})</h3>
                </div>
                <div className="space-y-3">
                  {vacinasFaltantes.map((vacina, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="font-bold text-red-900">{vacina.nome}</div>
                      <div className="text-sm text-gray-700 mt-1">Proteção: {vacina.protecao}</div>
                      <div className="text-sm text-red-600 mt-1">Deveria ter sido aplicada aos {formatarIdade(vacina.idade)}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-red-800 font-medium">
                  Procure um posto de saúde o mais breve possível para atualizar a carteira de vacinação.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-green-800">Parabéns!</h3>
                    <p className="text-green-700 mt-1">O calendário vacinal está em dia!</p>
                  </div>
                </div>
              </div>
            )}

            {proximasVacinas.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="ml-3 text-xl font-bold text-blue-800">Próximas Vacinas</h3>
                </div>
                <div className="space-y-3">
                  {proximasVacinas.map((vacina, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="font-bold text-blue-900">{vacina.nome}</div>
                      <div className="text-sm text-gray-700 mt-1">Proteção: {vacina.protecao}</div>
                      <div className="text-sm text-blue-600 mt-1 font-medium">Aplicar aos {vacina.idade}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">
            Informações baseadas no Calendário Nacional de Vacinação 2025 do Ministério da Saúde do Brasil
          </p>
          <p className="text-xs text-gray-500">
            Consulte sempre um profissional de saúde para orientações personalizadas
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;