module.exports = class Translate {
    constructor(options = {}) {
        this.options = options
        this.client = options.client
    }

    tl() {
        const prefix = this.prefix

        arguments['0'].nomeRpg = !arguments['0'].nomeRpg ? "null" : arguments['0'].nomeRpg
        arguments['0'].fichasUser = !arguments['0'].fichasUser ? ["null"] : arguments['0'].fichasUser
        arguments['0'].valor = !arguments['0'].valor ? "null" : arguments['0'].valor
        arguments['0'].qfichas = !arguments['0'].qfichas ? "null" : arguments['0'].qfichas
        arguments['0'].bdados = !arguments['0'].bdados ? "null" : arguments['0'].bdados
        arguments['0'].atributo = !arguments['0'].atributo ? "null" : arguments['0'].atributo
        arguments['0'].atb = !arguments['0'].atb ? "null" : arguments['0'].atb
        arguments['0'].tdados = !arguments['0'].tdados ? "null" : arguments['0'].tdados
        arguments['0'].cmd = !arguments['0'].cmd ? "null" : arguments['0'].cmd
        arguments['0'].novoNomeRpg = !arguments['0'].novoNomeRpg ? "null" : arguments['0'].novoNomeRpg
        arguments['0'].qdados = !arguments['0'].qdados ? "null" : arguments['0'].qdados
        arguments['0'].op = !arguments['0'].op ? "null" : arguments['0'].op
        arguments['0'].bdados = !arguments['0'].bdados ? "null" : arguments['0'].bdados
        arguments['0'].msg = !arguments['0'].msg ? { author: { id: "null", username: "null" }, guild: { name: "null" } } : arguments['0'].msg
        arguments['0'].msg.guild.name = !arguments['0'].msg.guild.name ? "null" : arguments['0'].msg.guild.name


        const linguas = new Map([
            ["pt-bt-conf", "Confirmar"],
            ["pt-bt-canc", "Cancelar"],
            ["pt-bt-desIrt", "Desativar este IRT"],
            ["pt-bt-apgIrt", "Apagar esta mensagem"],
            ["pt-created", "Criada por: "],
            ["pt-botI-gI", "Carregando informações"],
            ["pt-botI-fAu", "Criador: "],
            ["pt-botI-f2T", "Links Úteis"],
            ["pt-botI-f2V", "Meu Discord de Suporte"],
            ["pt-botI-f3V", "Vote em mim"],
            ["pt-botI-f4V", "Me convide para o seu servidor"],
            ["pt-botI-fStatusT1", "Uso de CPU"],
            ["pt-botI-fStatusT2", "Uso de RAM"],
            ["pt-botI-fStatusT4", "Servidores"],
            ["pt-botI-fStatusT5", "Usuários"],
            ["pt-botI-cmdAI", "Após iniciar:"],
            ["pt-botI-fCmd", "Comandos"],
            ["pt-botI-fStatusRT", "RAM Total"],
            ["pt-botI-uptime", "Tempo Online"],
            ["pt-cef-nArg", `Precisa de ajuda com o comando? tente usar ${prefix}ajuda ficha`],
            ["pt-cef-mFichas1", `Eu achei ${arguments['0'].fichasUser.length} fichas suas com os nomes de "${arguments['0'].fichasUser}", você precisa me dizer qual ficha quer que eu modifique`],
            ["pt-cef-mFichas2", `Eu achei ${arguments['0'].fichasUser.length} fichas suas com os nomes de "${arguments['0'].fichasUser}", você precisa me dizer qual ficha quer que eu modifique`],
            ["pt-cef-anIn", "Você precisa anexar um arquivo de imagem ou gif, qualquer outro tipo de arquivo não irá funcionar"],
            ["pt-cef-inUrl", "Você precisa anexar uma imagem ou colocar um link para que eu possa adicionar a sua ficha"],
            ["pt-cef-nVUrl", `"${arguments['0'].valor}" não é um URL válido, por que você não envia a imagem na minha DM e copia o link?`],
            ["pt-cef-nVExt", `Esse link não possue uma extensão de arquivo válida para imagem, as extensões válidas são .png, .jpg, .jpeg e .gif`],
            ["pt-cef-nVVal", `O valor de nenhum atributo pode ser vazio, se você não quer ele é só não colocar ele na sua ficha`],
            ["pt-cef-nAVal", "É necessário utilizar nesse comando, um atributo, para que possa adicionar algo a sua ficha"],
            ["pt-cef-updtFicha", `Ok, adicionei ${arguments['0'].atributo} como "${arguments['0'].valor}" na ficha "${arguments['0'].nomeRpg}"`],
            ["pt-cef-adcFicha", `Ok, adicionei ${arguments['0'].atributo} como "${arguments['0'].valor}" na ficha "${arguments['0'].nomeRpg}"`],
            ["pt-cef-delFicha", `Ok, apaguei o atributo "${arguments['0'].atributo}" da ficha "${arguments['0'].nomeRpg}"`],
            ["pt-cef-confCrFicha", `Deseja criar uma nova ficha com o nome "${arguments['0'].nomeRpg}"?`],
            ["pt-cef-cancelReact", `Tudo bem, comando cancelado`],
            ["pt-cef-sConfirm", `Sem confirmação após 30 segundos, nada foi feito`],
            ["pt-cef-nFichaEn", `Não achei nenhuma ficha com o nome ${arguments['0'].nomeRpg}, não tenho nada pra apagar`],
            ["pt-cef-atbNE", `${arguments['0'].atributo} não está na lista de atributos possíveis, tente olhar a lista em ${prefix}ajuda atributos`],
            ["pt-cef-nConf", "Não tenho nenhuma configuração sua salva, não tenho nada para apagar"],
            ["pt-cef-nFP", "Você não tem nenhuma ficha padrão definida, não tenho nada para apagar"],
            ["pt-cef-nFDB", `Você não tem nenhuma ficha com o nome "${arguments['0'].nomeRpg}", não posso definir algo que não existe como sua ficha padrão`],
            ["pt-cef-fPS", `Ok, agora a sua ficha padrão é: "${arguments['0'].nomeRpg}"`],
            ["pt-cef-cCNF", `Deseja criar uma nova ficha com o nome "${arguments['0'].nomeRpg}"?`],
            ["pt-cef-updtMulti", `Ok, adicionei "${arguments['0'].atributo}" com os valores "${arguments['0'].valor}" na ficha "${arguments['0'].nomeRpg}"`],
            ["pt-cef-updtMultiErr", `Ok, adicionei "${arguments['0'].atributo}" com os valores "${arguments['0'].valor}" na ficha "${arguments['0'].nomeRpg}"\n\nOs seguintes atributos não puderam ser adicionados: "${arguments['0'].atb}", pois, não estão na lista de atributos possíveis ou estão digitados de forma incorreta, corrija os erros ou adicione-os utilizando o extras no lugar do multi`],
            ["pt-cef-allAtbErr", `Nenhum dos atributos digitados está na lista de atributos possíveis (**${prefix}ajuda atributos** para ver a lista completa), ou foram digitados de forma incorreta, corrija erros ou utilize o **extras** no lugar do **multi** para adicionar seus atributos personalizados`],
            ["pt-cef-fPE", "Ok, agora você não tem mais uma ficha padrão definida"],
            ["pt-cef-lFE", "Você está atualmente no limite de fichas criadas por usuário (25 fichas), não é possível criar uma nova ficha, você pode tentar apagar alguma ficha que já não use mais para dar lugar a uma nova"],
            ["pt-af-fApg", `Ficha "${arguments['0'].nomeRpg}" apagada`],
            ["pt-af-fNE", `Não achei nenhuma ficha com o nome "${arguments['0'].nomeRpg}" no meu banco de dados, não tenho como apagar algo que não existe`],
            ["pt-af-cEF", `Tem certeza que deseja apagar a ficha "${arguments['0'].nomeRpg}"?`],
            ["pt-af-fM", `Ficha "${arguments['0'].nomeRpg}" mantida`],
            ["pt-af-sConfirm", `Sem confirmação após 30 segundos, ficha "${arguments['0'].nomeRpg}" mantida`],
            ["pt-af-sNomeRpg", `não posso apagar uma ficha sem que você me diga qual o nome dela`],
            ["pt-af-deacIrt", `IRT desativado para a ficha "${arguments['0'].nomeRpg}"`],
            ["pt-af-irtNF", `Não achei nenhuma ficha com IRT ativado com o nome "${arguments['0'].nomeRpg}"`],
            ["pt-efd-mFichas1", `Eu achei ${arguments['0'].fichasUser.length} fichas suas com os nomes de "${arguments['0'].fichasUser}", você precisa me dizer qual ficha quer que eu envie`],
            ["pt-efd-nFE", `Não achei nenhuma ficha sua com o nome "${arguments['0'].nomeRpg}" no meu banco de dados`],
            ["pt-efd-uSF", `Não achei nenhuma ficha sua para poder enviar, tente criar uma nova agora ${prefix}ajuda ficha`],
            ["pt-efd-bF", "Essa é uma função que ainda está em beta fechada, em breve, será liberada a todos"],
            ["pt-efd-irtMF", "Você já possui o limite (5) de fichas IRT ativas"],

            ["pt-efd-fCE", `Tem um problema com essa ficha. Você ainda pode ver a ficha utilizando \`/enviartxt\``],
            ["pt-efd-fE", `No campo "${arguments['0'].cmd[0]}", o ${arguments['0'].cmd[1]} do campo é maior do que o Discord permite enviar (${arguments['0'].cmd[2]} caracteres)`],
            ["pt-efd-fE2", `Um das seções (embeds) da ficha, excede o limite total de caracteres do Discord (6000 caracteres por embed)`],

            ["pt-ea-nArg", `Você precisa me dizer pelo menos qual o atributo quer que eu envie, você pode ver a lista completa de atributos em ${prefix}ajuda atributos`],
            ["pt-ea-embedTi", "Ficha: "],
            ["pt-ea-atbSV", `O atributo "${arguments['0'].atb}" não tem nenhum valor salvo na ficha "${arguments['0'].nomeRpg}"`],
            ["pt-ea-nFE", `Não achei nenhuma ficha com o nome "${arguments['0'].nomeRpg}" no meu banco de dados`],
            ["pt-ea-uSF", `Não achei nenhuma ficha sua para poder enviar um atributo, tente criar uma nova agora ${prefix}ajuda ficha`],
            ["pt-ea-mFichas", `Eu achei ${arguments['0'].fichasUser.length} fichas suas com os nomes de "${arguments['0'].fichasUser}", você precisa me dizer qual ficha quer que eu envie`],
            ["pt-eft-pEF", "Aqui está a ficha que você criou:"],
            ["pt-eft-nFE", `Não achei nenhuma ficha com o nome "${arguments['0'].nomeRpg}"`],
            ["pt-eft-fN", "Ficha_"],
            ["pt-eft-uSF", `Não achei nenhuma ficha sua para poder enviar, tente criar uma nova agora ${prefix}ajuda ficha`],
            ["pt-eft-mFichas", `Eu achei ${arguments['0'].fichasUser.length} fichas suas com os nomes de "${arguments['0'].fichasUser}", você precisa me dizer qual ficha quer que eu envie`],
            ["pt-vf-embedTi1", `Eu achei ${arguments['0'].qfichas} ficha que você criou`],
            ["pt-vf-embedTi2", `Eu achei ${arguments['0'].qfichas} fichas que você criou`],
            ["pt-vf-embedDesc1", `O nome da sua ficha é: **${arguments['0'].fichasUser}**`],
            ["pt-vf-embedDesc2", `Os nomes das suas fichas são: **${arguments['0'].fichasUser}**`],
            ["pt-vf-fNE", "Não achei nenhuma ficha sua, tente criar uma agora"],
            ["pt-cs-mA", "O número que você quer calcular é grande demais"],
            ["pt-cs-nArg", `Precisa de ajuda com o comando? tente usar ${prefix}ajuda sucesso`],
            ["pt-cs-vInv", `Não tenho como calcular seus sucessos para "${arguments['0'].valor}"`],
            ["pt-cs-embedTi", "Seus sucessos para " + arguments['0'].valor + " vão ser:"],
            ["pt-cs-embedDescExt", "Extremo será menor ou igual a"],
            ["pt-cs-embedDescBomPt1", "Bom será menor ou igual a "],
            ["pt-cs-embedDescBomPt2", "e maior que"],
            ["pt-cs-embedDescNor", "Normal será menor ou igual a"],
            ["pt-cs-embedDescFal", "Falha será maior que"],
            ["pt-rf-nArg", `Precisa de ajuda com o comando? ${prefix}ajuda renomear`],
            ["pt-rf-nNomeRpg", `Você precisa me dizer qual o novo nome da ficha`],
            ["pt-rf-nInv", `Você não tem nenhuma ficha com o nome "${arguments['0'].nomeRpg}"`],
            ["pt-rf-fRenomeada", `Ok, agora a ficha "${arguments['0'].nomeRpg}" se chama "${arguments['0'].novoNomeRpg}"`],
            ["pt-rf-nFE", `Não achei nenhuma ficha sua com o nome "${arguments['0'].nomeRpg}" no meu banco de dados`],
            ["pt-ddb-mFichas", `Eu achei ${arguments['0'].fichasUser.length} fichas suas com os nomes de "${arguments['0'].fichasUser}", você precisa me dizer qual ficha quer que eu use`],
            ["pt-ddb-uSF", `Não achei nenhuma ficha sua para poder rolar esse dado, tente criar uma nova agora ${prefix}ajuda ficha`],
            ["pt-ddb-embedTi1", `rolou 1d100 para ${arguments['0'].atb}`],
            ["pt-ddb-embedTi2", `rolou 1d100`],
            ["pt-ddb-atbSV", "Nenhum valor salvo"],
            ["pt-ddb-rF", "Falha"],
            ["pt-ddb-rN", "Normal"],
            ["pt-ddb-rB", "Bom"],
            ["pt-ddb-rE", "Extremo"],
            ["pt-ddb-rM", "Milagre"],
            ["pt-ddb-rD", "Desastre"],
            ["pt-ddb-Result", "Resultado"],
            ["pt-ddb-embedA", "Ficha: "],
            ["pt-ddb-errEx", `Desculpe, esse atributo não funciona com este comando`],
            ["pt-ddb-nFE", `Não achei nenhuma ficha com o nome "${arguments['0'].nomeRpg}" no meu banco de dados`],
            ["pt-ddb-rcS", `Ok, agora este canal está configurado para rolar dados sem utilizar o prefixo`],
            ["pt-ddb-rcUS", `Ok, agora este servidor não possuí mais um canal para rolar dados sem utilizar o prefixo`],
            ["pt-ddb-rcSP", `Você não possuí a permissão de Gereciar Canais ou Gerenciar Servidor neste servidor, não é possível utilizar esta função`],
            ["pt-ddb-rcGO", `Esta função só pode ser utilizada em servidores`],
            ["pt-onMsg-mPerms", `Oi, eu acabei de perceber que algumas permissões estão faltando no meu cargo no servidor "${arguments['0'].msg.guild}", assim, alguns comandos podem não funcionar corretamente, as permissões que estão faltando são: \n\n${arguments['0'].valor}`],
            ["pt-onMsg-mPermsTxt", `Oi, eu acabei de perceber que algumas permissões estão faltando no meu cargo neste servidor, assim, alguns comandos podem não funcionar corretamente, as permissões que estão faltando são: \n\n${arguments['0'].valor}`],
            ["pt-onMsg-ping", `Oi ${arguments['0'].msg.author.username}, meu prefixo é ` + "**`" + prefix + "`**," + ` se precisar de ajuda é só enviar ` + "**`" + `${prefix}ajuda` + "`** aqui mesmo ou na minha DM"],
            ["pt-onMsg-nArgDado", `Precisa de ajuda com o comando? tente usar ${prefix}ajuda roll`],
            ["pt-onMsg-dadoInv", `Ok, ${arguments['0'].msg.author.username} agora seus dados são vísiveis somente para você`],
            ["pt-onMsg-dadoInv2", `Ok, ${arguments['0'].msg.author.username} agora seus dados são vísiveis somente para você`],
            ["pt-onMsg-dadoVi", `Ok, ${arguments['0'].msg.author.username} agora seus dados são vísiveis para todos`],
            ["pt-onMsg-cmdBarrado", `Desculpe, somente pessoal autorizado pode usar esse comando`],
            ["pt-onMsg-insInv", `Ok, ${arguments['0'].msg.author.username} agora seus comandos de insanidade são vísiveis somente para você`],
            ["pt-onMsg-insInv2", `Ok, ${arguments['0'].msg.author.username} agora seus comandos de insanidade são vísiveis somente para você`],
            ["pt-onMsg-insVi", `Ok, ${arguments['0'].msg.author.username} agora seus comandos de insanidade são vísiveis para todos`],
            ["pt-onMsg-cmdBarrado2", "Somente pessoal autorizado pode usar esse comando"],
            ["pt-onMsg-sPerm", "Você precisa ter permissões de administrador, gerenciar canais ou de gerenciar servidor para poder alterar a minha língua"],
            ["pt-onMsg-cmdDsbDesc", `Este comando está desabilitado temporariamente\n\nMotivo: ${arguments[0].cmd}`],
            ["pt-onMsg-cmdDsbTi", "Comando Desabilitado"],
            ["pt-onMsg-slash", `O Discord decidiu que em alguns meses, os BOT's irão precisar de uma permissão especial para receber o conteúdo das mensagens, devido a isso, todos os comandos do BOT serão migrados para ** \`\ / \`\ ** e comandos por mensagens comuns deixarão de funcionar. Em caso de os comandos ** \`\ / \`\ ** do BOT não estarem disponíveis em seu servidor, remova o BOT do servidor e adicione novamente utilizando o link abaixo.`],
            ["pt-onMsg-btSlash", `Link para adicionar o BOT`],
            ["pt-onMsg-btSlashInfo", `Mais informações sobre a mudança`],
            ["pt-onGCreate-saudacao", `Olá humano lendo isso, obrigado por me adicionar no seu servidor, que tal dar uma olhada no **${prefix}ajuda**? Eu ainda estou em desenvolvimento se por um acaso acontecer algum problema, primeiro verifique as minhas permissões, caso o problema persistir, avise no **${prefix}sugestão**. If you prefer my commands in En-Us you can select this in ${prefix}language`],
            ["pt-onGCreate-saudacao2", `Olá humano lendo isso, obrigado por me adicionar no seu servidor, que tal dar uma olhada no **${prefix}ajuda**? Eu ainda estou em desenvolvimento se por um acaso acontecer algum problema, primeiro verifique as minhas permissões, caso o problema persistir, avise no **${prefix}sugestão**. If you prefer my commands in En-Us you can select this in ${prefix}language`],
            // }
            // ajuda.js {
            ["pt-ajuda-main", `Aqui você pode ver a lista completa de comandos disponíveis!
    
            O prefixo do BOT é \`${prefix}\` ou \`/\`
            
            <:cmdAjuda:766790214265733130> _Comandos do BOT:_
            
            <:dadosAjuda:766790214030852137> _Dado:_
            ㅤㅤ**roll (r)** - Rola um dado
            ㅤㅤ**insanidade (ins)** - Enviar uma insanidade aleatória
            ㅤㅤ**sucesso** - Calcula o sucesso de um dado (Call Of Cthulhu)
            <:fichaAjuda:766790214550814770> _Ficha:_
            ㅤㅤ**ficha (f)** - Cria e Edita uma ficha
            ㅤㅤ**atributos** - Lista todos os atributos
            ㅤㅤ**listar** - Mostra o nome das suas fichas
            ㅤㅤ**renomear** - Renomeia uma ficha
            ㅤㅤ**apagar** - Apaga uma ficha
            ㅤㅤ**enviar** - Envia sua ficha como embed
            ㅤㅤ**enviar_txt** - Enviar sua ficha como .txt
            ㅤㅤ**enviar_atributo (enviar_atb)** - Envia 1 atributo da sua ficha
            <:outrosAjuda:766790214110019586> _Outros:_
            ㅤㅤ**sugestão (bug, suporte)** - Envia uma mensagem para o BOT
            ㅤㅤ**botinfo** - Mostra informações sobre o BOT
            ㅤㅤ**linguagem** - Altera o idioma do BOT
            ㅤㅤ**votar** - Envia o link para votar no BOT
            ㅤㅤ**convite** - Envia o link para adicionar o BOT
            ㅤㅤ**ping** - Mostra o ping do BOT
            ㅤㅤ**termos** - Envia o link para ler os Termos de Uso do BOT
            ㅤㅤ**config** - Configurações do usuário
             
            É recomendado ler os termos de uso do BOT
             `],
            ["pt-ajuda-btTermos", "Termos de Uso"],

            ["pt-ajuda-atributos", `
            \nO atributo **extras** serve para adicionar atributos customizados a sua ficha
    
            _Formato do comando:_
            **${prefix}ficha <nome_Rpg> extras <seu_atributo>:<valor> | <seu_atributo2>:<valor>**
            
            <:avisoAjuda:766826097051828235> " : " -> Separa um atributo de seu valor
            <:avisoAjuda:766826097051828235> " | " -> Sepera diferentes atributos
            <:avisoAjuda:766826097051828235> **Este formato de comando só é válido para o atributos Extras**
    
            `],

            ["pt-ajuda-tMain", "Meus Comandos"],
            ["pt-ajuda-tAtributos", "Atualmente os atributos possíveis são:"],
            ["pt-ajuda-mPH", "Selecione um comando para visualizar"],
            ["pt-sugestao-mEnv", `Prontinho, mensagem enviada!`],
            ["pt-sugestao-nArg", `Precisa de ajuda com o comando? tente usar ${prefix}ajuda sugestão`],
            ["pt-dados-nArgs", ` Precisa de ajuda com o comando? tente usar ${prefix}ajuda roll`],
            ["pt-dados-tDadosMA", `Pega leve aí, ${arguments['0'].tdados} é um número meio alto, não acha?`],
            ["pt-dados-bDadosMA", `Na minha opnião, ${arguments['0'].bdados}, é um pouco demais, entende?`],
            [`pt-dados-dadoInv`, `Não consegui rolar "${arguments['0'].cmd}", verifique se não tem algum erro`],
            [`pt-dados-embedR1Tib`, `rolou 1d`],
            [`pt-dados-embedR1Ti`, `rolou 1d`],
            ["pt-dados-rMA", `Não consegui rolar "${arguments['0'].cmd}", o resultado seria grande demais, lembre-se que o limite do discord é só de 2000 caracteres`],
            ["pt-dados-embedR2", `rolou`],
            ["pt-dados-embedR2Ti", `rolou ${arguments['0'].qdados}d${arguments['0'].tdados}`],
            ["pt-dados-nD", `Não consegui diferenciar o que é um dado e o que é um bônus, em um dado de vários segmentos, pelo menos 1 deles precisa de um "d", por exemplo, "d10+3"`],
            ["pt-ef-infAuthor", "Ficha: "],
            ["pt-ef-stpTi", "Status do Personagem"],
            ["pt-ef-extPersoTi", "Extras"],
            ["pt-ef-infoPersoTi", "Informações do Personagem"],
            ["pt-ef-descPerso", "Descrição do Personagem"],
            ["pt-ef-eLE", `Você atingiu o limite máximo de atributos extras em uma ficha (25), você ainda poderá ver os valores utilizando o comando ${prefix}enviar_txt`],
            ["pt-ins-nArg", `Precisa de ajuda com o comando? ${prefix}ajuda insanidade`],
            ["pt-ins-embedPermTi", `Insanidade permanente`],
            ["pt-ins-embedPermDesc", `Eu rolei um dado e o personagem desenvolve: `],
            ["pt-ins-embedPermDesc2inPt1", `Eu rolei um dado, o número foi alto e o personagem desenvolve:`],
            ["pt-ins-embedPermDesc2inPt2", `e também`],
            ["pt-ins-embedPermDesc3in", "Eu rolei um dado, e tivemos um _desastre_, o personagem desenvolve:"],
            ["pt-ins-embedTempTi", "Insanidade temporária"],
            ["pt-ins-embedTempDesc", "Eu rolei um dado e agora o personagem: "],
            ["pt-txt-h1", "--Informações do Personagem----------------------------------------------------------------------------\n"],
            ["pt-txt-h2", "--Status do Personagem---------------------------------------------------------------------------------\n"],
            ["pt-txt-h3", "--Atributos Extras-------------------------------------------------------------------------------------\n"],
            ["pt-txt-h4", "--Descrição do Personagem------------------------------------------------------------------------------\n"],
            ["pt-eL-embedTi", "Escolha que linguagem deseja usar neste servidor"],
            ["pt-eL-embedDesc", `Clique na língua que preferir, lembrando que a linguaguem original é Pt-Br
    
        Você está atualmente em Pt-Br 🇧🇷
        Click at: 🇺🇸 so that all commands on this server change to En-Us
    
        **Mais línguas disponíveis em breve**`],
            ["pt-eL-br", "Ok, agora todos os meus comandos neste servidor estão em Pt-Br"],
            ["pt-eL-brDm", "Ok, agora todos os meus comandos nesta DM estão em Pt-Br"],
            ["pt-eL-cancel", "Ok, nada foi feito"],
            ["pt-eL-sR", "Sem nenhuma escolha após 2 minutos, nada foi feito"],
            ["pt-as-timeTiT", "Foi banido temporariamente"],
            ["pt-as-timeTiP", "Foi banido permanentemente"],
            ["pt-as-timeDescP", "Você foi permanentemente banido de utilizar os comandos do BOT por **SPAM**. Se acha que está punição foi errada entre no [meu servidor de suporte](https://discord.com/invite/9rqCkFB) e faça sua reclamação"],
            ["pt-as-timeDescT", "Você foi temporariamente banido de utilizar os comandos do BOT por **SPAM**. Se acha que está punição foi errada entre no [meu servidor de suporte](https://discord.com/invite/9rqCkFB) e faça sua reclamação"],
            ["pt-as-timeF", "Você está banido até:"],
            ["pt-as-cooldown", `Espere mais ${arguments['0'].valor} segundos antes de usar o próximo comando`],
            ["pt-inv-embedDesc", "Então você quer me adicionar em outros servidores? Que bom, quanto mais gente melhor!"],
            ["pt-inv-embedFT", "É só clicar aqui!"],
            ["pt-vote-embedDesc", "Então você quer me votar em mim? Ainda bem, isso me ajuda bastante!"],
            ["pt-vote-embedFT", "É só clicar aqui!"],
            ["pt-termos-embedDesc", "Que bom que você quer ler os termos de uso, é bem importante!"],
            ["pt-termos-embedFT", "Basta clicar aqui!"],
            ["pt-util-voteTi", `Olha só, você votou em mim!`],
            ["pt-util-voteDesc", `${arguments[0].valor} obrigado por votar em mim! Votos me ajudam a ganhar visibilidade, consequentemente me fazem crescer, por enquanto, tudo que posso fazer é agradecer por isso!`],
            ["pt-int-sDM", "Atualmente, slash commands na DM não são suportados, você ainda pode utilizar os comandos com prefixo sem problemas."],
            ["pt-int-nAddC", "Eu não possúo as permissões necessárias para executar slash commands neste servidor, para resolver este problema, basta readicionar o Kami no servidor utilizando este link:"],
            ["pt-config-guiTi", "Configurações do usuário:"],
            ["pt-config-guiF1", "Rolagem secreta:"],
            ["pt-config-guiF2", "Insanidade secreta:"],
            ["pt-config-guiF3", "Ficha padrão:"],
            ["pt-config-guiAct", "✅ Ativado"],
            ["pt-config-guiDes", "❌ Desativado"],
            ["pt-config-guiSFP", "Sem ficha padrão"],
            ["pt-config-menuPH", "Selecione uma ficha"],
            ["pt-config-menuEFP", "Excluir ficha padrão"],
            ["pt-config-btDesRS", "Desativar rolagem secreta"],
            ["pt-config-btActRS", "Ativar rolagem secreta"],
            ["pt-config-btDesIS", "Desativar insanidade secreta"],
            ["pt-config-btActIS", "Ativar insanidade secreta"],
            ["pt-config-btF", "Finalizar"],

            // Fim da parte PT-BR

            // Inicio da parte EN-US
            ["en-bt-conf", "Confirm"],
            ["en-bt-canc", "Cancel"],
            ["en-bt-desIrt", "Deactivate this IRT"],
            ["en-bt-apgIrt", "Delete this message"],
            ["en-created", "Created by: "],
            ["en-botI-gI", "Loading information"],
            ["en-botI-fAu", "Creator: "],
            ["en-botI-f2T", "Useful Links"],
            ["en-botI-f2V", "My support Discord guild"],
            ["en-botI-f3V", "Vote for me"],
            ["en-botI-f4V", "Invite me to your guild"],
            ["en-botI-fStatusT1", "Use of CPU"],
            ["en-botI-fStatusT2", "Use of RAM"],
            ["en-botI-fStatusT4", "Guilds"],
            ["en-botI-fStatusT5", "Users"],
            ["en-botI-cmdAI", "After start:"],
            ["en-botI-fCmd", "Commands"],
            ["en-botI-fStatusRT", "Total RAM"],
            ["en-botI-uptime", "Uptime"],
            ["en-cef-nArg", `Need help with the command? try using ${prefix}help sheet`],
            ["en-cef-mFichas1", `I found ${arguments['0'].fichasUser.length} sheets of yours with the names of "${arguments['0'].fichasUser}", you need tell me which sheet you want me to modify`],
            ["en-cef-mFichas2", `I found ${arguments['0'].fichasUser.length} sheets of yours with the names of "${arguments['0'].fichasUser}", you need tell me which sheet you want me to modify`],
            ["en-cef-anIn", "You need to attach an image or gif file, any other file type will not work"],
            ["en-cef-inUrl", "You need to attach an image or place a link so that I can add it to your sheet"],
            ["en-cef-nVUrl", ` ${arguments['0'].valor} is not a valid URL, why don't you upload the image in my DM and copy the link?`],
            ["en-cef-nVExt", `This link does not have a valid image file extension, valid extensions are .png, .jpg, .jpeg and .gif`],
            ["en-cef-nVVal", `The value of any attribute can be empty, if you don't want it is just don't put it`],
            ["en-cef-nAVal", "You need to use an attribute in this command, so you can add something to your sheet"],
            ["en-cef-updtFicha", `Ok, i added ${arguments['0'].atributo} as "${arguments['0'].valor}" on the sheet "${arguments['0'].nomeRpg}"`],
            ["en-cef-adcFicha", `Ok, i added ${arguments['0'].atributo} as "${arguments['0'].valor}" on the sheet "${arguments['0'].nomeRpg}"`],
            ["en-cef-delFicha", `Ok, i deleted the attribute "${arguments['0'].atributo}" from the sheet "${arguments['0'].nomeRpg}"`],
            ["en-cef-confCrfFicha", `Would you like to create a new sheet with the name "${arguments['0'].nomeRpg}"`],
            ["en-cef-cancelReact", `All right, command cancelled`],
            ["en-cef-sConfirm", `Without confirmation after 30 seconds, nothing was done`],
            ["en-cef-nFichaEn", `I didn't find any sheet with the name ${arguments['0'].nomeRpg}, I have nothing to delete`],
            ["en-cef-nFE", ` I didn't find any sheet with the name ${arguments['0'].nomeRpg}, I have nothing to delete`],
            ["en-cef-atbNE", `${arguments['0'].atributo} is not in the list of possible attributes, try looking at the list in ${prefix}help attributes`],
            ["en-cef-updtMulti", `Ok, I added "${arguments['0'].atributo}" with the values "${arguments['0'].valor}" to the "${arguments['0'].nomeRpg}" sheet`],
            ["en-cef-updtMultiErr", `Ok, I added "${arguments['0'].atributo}" with the values "${arguments['0'].valor}" to the "${arguments['0'].nomeRpg}" sheet\n\nThe following attributes could not be added: "${arguments['0'].atb}", because they are not in the list of possible attributes or are typed incorrectly, correct the errors or add them using the extras instead of multi`],
            ["en-cef-allAtbErr", `None of the attributes entered are in the list of possible attributes (**${prefix}help attributes** to see the full list), or were entered incorrectly, correct errors or use **extras** instead of **multi** to add your custom attributes`],
            ["en-cef-nConf", "I have no settings of yours saved, I have nothing to delete"],
            ["en-cef-nFP", "You don't have any default sheet set, I have nothing to delete"],
            ["en-cef-nFDB", `You don't have any sheet named "${arguments['0'].nomeRpg}", I can't set something that doesn't exist as your default sheet`],
            ["en-cef-fPS", `Ok, now your default sheet is: "${arguments['0'].nomeRpg}"`],
            ["en-cef-cCNF", `Would you like to create a new sheet with the name "${arguments['0'].nomeRpg}"?`],
            ["en-cef-fPE", "Ok, now you no longer have a standard sheet defined"],
            ["en-cef-lFE", "You are currently at the limit of tokens created per user (25 tokens), you cannot create a new token, you can try to delete any token you no longer use to make place for a new one"],
            ["en-af-fApg", `Sheet "${arguments['0'].nomeRpg}" deleted`],
            ["en-af-fNE", `I didn't find any sheet named "${arguments['0'].nomeRpg}" in my database, I can't delete something that doesn't exist`],
            ["en-af-cEF", `Are you sure you want to delete the "${arguments['0'].nomeRpg}" sheet?`],
            ["en-af-fM", `Sheet "${arguments['0'].nomeRpg}" maintained`],
            ["en-af-sConfirm", `No confirmation after 30 seconds, "${arguments['0'].nomeRpg}" sheet maintained`],
            ["en-af-sNomeRpg", `I can't delete a sheet without you telling me what its name is`],
            ["en-af-deacIrt", `IRT disabled for sheet "${arguments['0'].nomeRpg}"`],
            ["en-af-irtNF", `I didn't find any IRT-enabled sheet with the name "${arguments['0'].nomeRpg}"`],
            ["en-efd-mFichas1", `I found ${arguments['0'].fichasUser.length} sheets of yours with the names of "${arguments['0'].fichasUser}", you need to tell me which sheet you want me to send`],
            ["en-efd-nFE", `Didn't find any sheet of yours with the name "${arguments['0'].nomeRpg}" in my database`],
            ["en-efd-uSF", `I couldn't find any of your sheets to send, try create a new one now ${prefix}help sheet`],
            ["en-efd-bF", "This is a function that is still in beta closed, will soon be released to all users"],
            ["en-efd-irtMF", "You already have the limit (5) of IRT sheets active"],

            ["en-efd-fCE", `There is a problem with this sheet. You can still view the sheet using \`/enviartxt\``],
            ["en-efd-fE", `In the field "${arguments['0'].cmd[0]}", the ${arguments['0'].cmd[1]} of the field is larger than the Discord allows to send (${arguments['0'].cmd[2]} characters)`],
            ["en-efd-fE2", `One of the sections (embeds) of the sheet, exceeds Discord's total character limit (6000 characters per embed)`],

            ["en-ea-nArg", `You need to tell me at least which attribute you want me to send, you can see the complete list of attributes in ${prefix}help attributes`],
            ["en-ea-uSF", `I couldn't find any of your sheets to send a attribute, try create a new one now ${prefix}help sheet`],
            ["en-ea-embedTi", "Sheet: "],
            ["en-ea-atbSV", `The attribute "${arguments['0'].atb}" has no value saved in the sheet "${arguments['0'].nomeRpg}"`],
            ["en-ea-nFE", `I didn't find any sheet with the name "${arguments['0'].nomeRpg}" in my database`],
            ["en-ea-mFichas", `I found ${arguments['0'].fichasUser.length} sheets of yours with the names of "${arguments['0'].fichasUser}", you need to tell me which sheet you want me to send`],
            ["en-eft-pEF", "Here is the sheet that you created:"],
            ["en-eft-fN", "Sheet_"],
            ["en-eft-uSF", `I couldn't find any of your sheets to send, try create a new one now ${prefix}help sheet`],
            ["en-eft-nFE", ` I didn't find any sheet with the name "${arguments['0'].nomeRpg}"`],
            ["en-eft-mFichas", `I found ${arguments['0'].fichasUser.length} sheets of yours with the names of "${arguments['0'].fichasUser}", you need tell me which sheet you want me to modify`],
            ["en-vf-embedTi1", `I found ${arguments['0'].qfichas} sheet that you created`],
            ["en-vf-embedTi2", `I found ${arguments['0'].qfichas} sheets that you created`],
            ["en-vf-embedDesc1", `Your sheet name is: **${arguments['0'].fichasUser}**`],
            ["en-vf-embedDesc2", `The names of your sheets are: **${arguments['0'].fichasUser}**`],
            ["en-vf-fNE", `I didn't find any sheet of yours, try to create one now`],
            ["en-cs-mA", "The number you want calculate is too big"],
            ["en-cs-nArg", `Need help with the command? try using ${prefix}help sucess`],
            ["en-cs-vInv", `I have no way to calculate your success to "${arguments['0'].valor}"`],
            ["en-cs-embedTi", "Your successes for " + arguments['0'].valor + " will be:"],
            ["en-cs-embedDescExt", "Extreme will be less than or equal to"],
            ["en-cs-embedDescBomPt1", "Good will be less than or equal to "],
            ["en-cs-embedDescBomPt2", "and greater than"],
            ["en-cs-embedDescNor", "Normal will be less or equal to"],
            ["en-cs-embedDescFal", "Failure will be greater than"],
            ["en-rf-nArg", `Need help with the command? ${prefix}help rename`],
            ["en-rf-nNomeRpg", `You need to tell me what the new name of the sheet is`],
            ["en-rf-nInv", `You don't have any sheet with the name "${arguments['0'].nomeRpg}"`],
            ["en-rf-fRenomeada", `Ok, now the "${arguments['0'].nomeRpg}" sheet is called "${arguments['0'].novoNomeRpg}"`],
            ["en-rf-nFE", `I didn't find any sheet of yours with the name "${arguments['0'].nomeRpg}" in my database`],
            ["en-ddb-mFichas", `I found ${arguments['0'].fichasUser.length} sheets of yours with the names of "${arguments['0'].fichasUser}", you need to tell me which sheet you want me to use`],
            ["en-ddb-uSF", `I couldn't find any of your sheets to roll this dice, try create a new one now ${prefix}help sheet`],
            ["en-ddb-embedTi1", `rolled 1d100 to ${arguments['0'].atb}`],
            ["en-ddb-embedTi2", `rolled 1d100`],
            ["en-ddb-atbSV", "No value saved"],
            ["en-ddb-rF", `Failure`],
            ["en-ddb-rN", `Normal`],
            ["en-ddb-rB", `Good`],
            ["en-ddb-rE", `Extreme`],
            ["en-ddb-rM", `Miracle`],
            ["en-ddb-rD", `Disaster`],
            ["en-ddb-Result", `Result`],
            ["en-ddb-embedA", "Sheet: "],
            ["en-ddb-errEx", `Sorry, this attribute does not work with this command`],
            ["en-ddb-nFE", `I didn't find any sheet with the name "${arguments['0'].nomeRpg}" in my database`],
            ["en-ddb-rcS", `Ok, now this channel is configured to roll dice without using the prefix`],
            ["en-ddb-rcUS", `Ok, now this server no longer has a channel to roll dices without using the prefix`],
            ["en-ddb-rcSP", `You do not have the Manage Channels or Manage Guild permission on this server, you cannot use this function`],
            ["en-ddb-rcGO", `This function can only be used on guilds`],
            ["en-onMsg-mPerms", `Hi, I just realized that some permissions are missing in my role on guild "${arguments['0'].msg.guild.name}", so some commands may not work properly, the missing permissions are: \n\n${arguments['0'].valor}`],
            ["en-onMsg-mPermsTxt", `Hi, I just realized that some permissions are missing in my role on this guild, so some commands may not work properly, the missing permissions are: \n\n${arguments['0'].valor}`],
            ["en-onMsg-ping", `Hello ${arguments['0'].msg.author.username}, my prefix is ` + "**`" + prefix + "`**," + ` if you need help just send ` + "**`" + `${prefix}help` + "`*** right here or in my DM`"],
            ["en-onMsg-nArgDado", `Need help with the command? try using ${prefix}help roll`],
            ["en-onMsg-dadoInv", `Ok, ${arguments['0'].msg.author.username} now your dices are visible only to you`],
            ["en-onMsg-dadoInv2", `Ok, ${arguments['0'].msg.author.username} now your dices are visible only to you`],
            ["en-onMsg-dadoVi", `Ok, ${arguments['0'].msg.author.username} now your dices are visible to everyone`],
            ["en-onMsg-cmdBarrado", `Sorry, only authorized people can use this command`],
            ["en-onMsg-insInv", `Ok, ${arguments['0'].msg.author.username} now your insanity commands are visible only to you`],
            ["en-onMsg-insInv2", `Ok, ${arguments['0'].msg.author.username} now your insanity commands are visible only to you`],
            ["en-onMsg-insVi", `Ok, ${arguments['0'].msg.author.username} now your insanity commands are visible to everyone`],
            ["en-onMsg-cmdBarrado2", `Sorry, only authorized people can use this command`],
            ["en-onMsg-sPerm", "You need to have administrator, manage channels or manage server permissions to change my language"],
            ["en-onMsg-cmdDsbDesc", `This command is temporarily disabled\n\n Reason: ${arguments[0].cmd}`],
            ["en-onMsg-cmdDsbTi", "Command Disabled"],
            ["en-onMsg-slash", `Discord has decided that in a few months, BOTs will need special permission to receive message content, due to this, all BOT commands will be migrated to ** \`\ / \`\ ** and regular message commands will no longer work. In case the BOT's ** \`\ / \`\ ** commands are not available on your server, remove the BOT from the server and add it again using the link below.`],
            ["en-onMsg-btSlash", `Link to add the BOT`],
            ["en-onMsg-btSlashInfo", `More information about the change`],
            ["en-onGCreate-saudacao", `Hello human reading this, thanks for adding me to your server, how about taking a look at ** ${prefix} help **? I'm still in development if by any chance a problem happens, first check my permissions, if the problem persists, let me know at **${prefix}suggestion**. Se você preferir os meus comandos em Pt-Br, você pode selecionar isso em ${prefix}linguagem`],
            ["en-onGCreate-saudacao2", `Hello human reading this, thanks for adding me to your server, how about taking a look at **${prefix}help**? I'm still in development if by any chance a problem happens, first check my permissions, if the problem persists, let me know at **${prefix}suggestion**. Se você preferir os meus comandos em Pt-Br, você pode selecionar isso em ${prefix}linguagem`],
            ["en-ajuda-main", `
            Here you can see the complete list of available commands!
    
            The prefix of the BOT is \`${prefix}\` or \`/\`
            
            <:cmdAjuda:766790214265733130> _Commands of the BOT:_
            
            <:dadosAjuda:766790214030852137> _Dice:_
            ㅤㅤ**roll (r)** - Roll a dice
            ㅤㅤ**insanity (ins)** - Send a random insanity
            ㅤㅤ**sucess** - Calculates the success of a dice (Call Of Cthulhu)
            <:fichaAjuda:766790214550814770> _Sheet:_
            ㅤㅤ**sheet (s)** - Creates and edit a sheet
            ㅤㅤ**attributes** - List all attributes
            ㅤㅤ**list** - Shows the name of your sheets
            ㅤㅤ**rename** - Ranames a sheet
            ㅤㅤ**delete** - Deletes a sheet
            ㅤㅤ**send** - Sends your sheet as embed
            ㅤㅤ**send_txt** - Sends your sheet as .txt
            ㅤㅤ**send_attribute (send_atb)** - Sends only 1 attribute from your sheet
            <:outrosAjuda:766790214110019586> _Others:_
            ㅤㅤ**suggestion (bug, support)** - Sends a message to the BOT
            ㅤㅤ**botinfo** - Shows information about the BOT
            ㅤㅤ**language** - Change de language of the BOT
            ㅤㅤ**vote** - Sends the link to vote for the BOT
            ㅤㅤ**invite** - Sends the link to add the BOT
            ㅤㅤ**ping** - Displays the BOT's ping
            ㅤㅤ**terms** - Send the link to read the Terms Of Use of the BOT
            ㅤㅤ**config** - User's config
             
            It is recommended to read BOT's Terms of Use. You can use ${prefix}terms any time.
             `],
            ["en-ajuda-btTermos", "Terms of Use"],

            ["en-ajuda-atributos", `
        \nThe attribute **extras** is used to add custom attributes to your sheet
    
        _Format of the command:_
        **${prefix}sheet <sheet_name> extras <your_attribute>:<value> | <your_attribute2>:<value>**
        
        <:avisoAjuda:766826097051828235> " : " -> Separates an attribute from its value
        <:avisoAjuda:766826097051828235> " | " -> Separates different attributes
        <:avisoAjuda:766826097051828235> **This command format is only valid for the Extras attributes**`],


            ["en-ajuda-tMain", "My Commands"],
            ["en-ajuda-tAtributos", "Currently the possible attributes are:"],
            ["en-ajuda-mPH", "Select a command to visualize"],
            ["en-sugestao-mEnv", "Done, message sent!"],
            ["en-sugestao-nArg", `Need help with the command? try using ${prefix}help suggestion`],
            ["en-dados-nArgs", ` Need help with the command? try using ${prefix}help roll`],
            ["en-dados-tDadosMA", `Take it easy there, ${arguments['0'].tdados} is a little high, don't you think?`],
            ["en-dados-bDadosMA", `In my opinion, ${arguments['0'].bdados}, is a bit much, you know?`],
            ["en-dados-dadoInv", `I couldn't roll "${arguments['0'].cmd}", check that there are no errors`],
            ["en-dados-embedR1Tib", `rolled 1d`],
            ["en-dados-embedR1Ti", `rolled 1d`],
            ["en-dados-rMA", `I could not roll "${arguments['0'].cmd}", the result would be too big, remember that the limit of Discord is only 2000 characters`],
            ["en-dados-embedR2Tib", `rolled ${arguments['0'].qdados}d${arguments['0'].tdados}${arguments['0'].op}${arguments['0'].bdados}`],
            ["en-dados-embedR2Ti", `rolled ${arguments['0'].qdados}d${arguments['0'].tdados}`],
            ["en-dados-embedR2", `rolled`],
            ["en-dados-nD", `I couldn't differentiate what is a dice and what is a bonus, on a multi-segment dice, at least 1 of them needs a "d", for example, "d10+3"`],
            ["en-ef-infAuthor", `Sheet: `],
            ["en-ef-stpTi", "Character Status"],
            ["en-ef-extPersoTi", "Extras"],
            ["en-ef-infoPersoTi", "Character Information"],
            ["en-ef-descPerso", "Character Description"],
            ["en-ef-eLE", `You have reached the maximum limit of extra attributes on a sheet (25 attributes), you can still see the values using the command ${prefix}send_txt`],
            ["en-ins-nArg", `Need help with the command? ${prefix}help insanity`],
            ["en-ins-embedPermTi", `Permanent insanity`],
            ["en-ins-embedPermDesc", `I rolled a dice and the character evolves:`],
            ["en-ins-embedPermDesc2inPt1", `I rolled a dice, the number was high and the character develops:`],
            ["en-ins-embedPermDesc2inPt2", `and also`],
            ["en-ins-embedPermDesc3in", `I rolled a dice, and we had a _disaster_, the character develops:`],
            ["en-ins-embedTempTi", `Temporary insanity`],
            ["en-ins-embedTempDesc", `I rolled a dice and now the character:`],
            ["en-txt-h1", "--Character Information--------------------------------------------------------------------------------\n"],
            ["en-txt-h2", "--Character Status-------------------------------------------------------------------------------------\n"],
            ["en-txt-h3", "--Extra Attributes-------------------------------------------------------------------------------------\n"],
            ["en-txt-h4", "--Character Description--------------------------------------------------------------------------------\n"],
            ["en-eL-embedTi", "Choose which language you want to use on this server"],
            ["en-eL-embedDesc", `Click in the language you prefer, remembering that the original language is Pt-Br
    
        You are currently in En-Us 🇺🇸
        Clique em: 🇧🇷 para que todos os comandos neste servidor mudem para Pt-Br
    
        **More languages available soon**`],
            ["en-eL-en", "Ok, now all my commands on this server are in En-Us"],
            ["en-eL-enDm", "Ok, now all my commands on this DM are in En-Us"],
            ["en-eL-cancel", "Ok, nothing was done"],
            ["en-eL-sR", "No choice after 2 minutes, nothing was done"],
            ["en-as-timeTiP", "was permanently banned"],
            ["en-as-timeTiT", "was temporally banned"],
            ["en-as-timeDescP", "You have been permanently banned from using BOT commands by **SPAM**. If you think that this punishment was wrong enter in [my support guild](https://discord.com/invite/9rqCkFB) and make your appeal"],
            ["en-as-timeDescT", "You have been temporally banned from using BOT commands by **SPAM**. If you think that this punishment was wrong enter in [my support guild](https://discord.com/invite/9rqCkFB) and make your appeal"],
            ["en-as-timeF", "You are banned until:"],
            ["en-as-cooldown", `Wait more ${arguments['0'].valor} seconds before using the next command`],
            ["en-inv-embedDesc", "So you want to add me on other servers? Good, the more people the better!"],
            ["en-inv-embedFT", "Just click here!"],
            ["en-inv-embedDesc", "So you want to add me on other servers? Good, the more people the better!"],
            ["en-inv-embedFT", "Just click here!"],
            ["en-vote-embedDesc", "So you want to vote for me? Good, that helps me a lot!"],
            ["en-vote-embedFT", "Just click here!"],
            ["en-termos-embedDesc", "Glad you want to read the terms of use, it's very important!"],
            ["en-termos-embedFT", "Just click here!"],
            ["en-util-voteTi", `Look, you voted for me!`],
            ["en-util-voteDesc", `${arguments[0].valor} thank you for voting for me! Votes help me gain visibility, consequently they make me grow, for now, all I can do is thank you for that!`],
            ["en-config-guiTi", "User settings:"],
            ["en-config-guiF1", "Secret roll:"],
            ["en-config-guiF2", "Secret insanity:"],
            ["en-config-guiF3", "Default sheet:"],
            ["en-config-guiAct", "✅ Enabled"],
            ["en-config-guiDes", "❌ Disabled"],
            ["en-config-guiSFP", "No default sheet"],
            ["en-config-menuPH", "Select a sheet"],
            ["en-config-menuEFP", "Delete default sheet"],
            ["en-config-btDesRS", "Disable secret roll"],
            ["en-config-btActRS", "Enable secret roll"],
            ["en-config-btDesIS", "Disable secret insanity"],
            ["en-config-btActIS", "Enable secret insanity"],
            ["en-config-btF", "Finish"],
            //Fim da Parte EN-US
        ])

        if (linguas.get(arguments['0'].local) == undefined) {
            this.log.error("Erro no translate, Local: " + arguments['0'].local, true)
        }

        return linguas.get(arguments['0'].local)
    }

}
