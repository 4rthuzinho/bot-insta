const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const path = require('path');

// Configurações
const USERNAME = 'lastore.brasill';
const PASSWORD = 'Ichat@2024*';
const DESTINO = '4rthuzinho'; // @ do perfil (sem o "@")
const MENSAGEM = 'Fala mano! Mensagem via bot Instagram 🤖';

const ig = new IgApiClient();

// Carrega ou gera device
ig.state.generateDevice(USERNAME);

(async () => {
  try {
    // Se existir auth.json, usa o estado salvo
    const statePath = path.resolve(__dirname, 'auth.json');
    if (fs.existsSync(statePath)) {
      await ig.state.deserialize(JSON.parse(fs.readFileSync(statePath, 'utf8')));
      console.log('✅ Sessão restaurada com sucesso!');
    } else {
      // Faz login e salva estado
      await ig.account.login(USERNAME, PASSWORD);
      const authState = await ig.state.serialize();
      fs.writeFileSync(statePath, JSON.stringify(authState));
      console.log('🔐 Login realizado e sessão salva!');
    }

    // Busca o ID do destinatário
    const usuario = await ig.user.searchExact(DESTINO);
    await ig.directThread.broadcast({
      userIds: [usuario.pk.toString()],
      text: MENSAGEM,
    });

    const agora = new Date().toLocaleString('pt-BR');
    console.log(`📤 ${agora} | Mensagem enviada para ${DESTINO}`);
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
})();