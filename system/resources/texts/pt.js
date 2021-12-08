function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

permissoes = new Map([
    ["ADD_REACTIONS", "Adicionar reações"],
    ["VIEW_CHANNEL", "Ler canais de texto e ver canais de voz"],
    ["SEND_MESSAGES", "Enviar mensagens"],
    ["EMBED_LINKS", "Inserir links"],
    ["ATTACH_FILES", "Anexar arquivos"],
    ["USE_EXTERNAL_EMOJIS", "Usar emojis externos"],
    ["MANAGE_MESSAGES", "Gerenciar mensagens"],
    ["READ_MESSAGE_HISTORY", "Ver histórico de mensagens"]
])

const atributos = ["nome", "altura", "idade", "peso", "profissao", "competencias", "equipamentos", "constituicao", "disposicao", "forca", "destreza", "sorte", "acrobacia",
    "inteligencia", "perspicacia", "carisma", "agilidade", "conhecimento", "furtividade", "percepcao", "sobrevivencia", "vontade", "magia", "sanidade", "linguas", "ciencias", "erudicao",
    "investigacao", "medicina", "mitosdocthulhu", "ocultismo", "oficio", "politica", "descricao", "imagem", "defeitos", "luta", "armasbrancas", "armasdefogo", "fadiga", "memoria",
    "lucidez", "extras", "vida", "encontrar", "escutar", "classe", "adestraranimais", "atletismo", "atuacao", "cavalgar", "cura", "diplomacia", "enganacao", "identificarmagias",
    "iniciativa", "intimidacao", "intuicao", "ladinagem", "obterinformacoes", "sabedoria", "nivel", "divindade", "deslocamento", "tendencia", "corpoacorpo", "ataquesadistancia",
    "armas", "armadura", "habilidadesderaca", "habilidadesdeclasse", "talentos", "dinheiro", "idiomas", "arcanismo", "blefar", "historia", "lidarcomanimais", "natureza",
    "persuasao", "prestidigitacao", "religiao", "classedaarmadura", "ligacoes", "fofura", "resistencia", "raca", "defesa", "escudo", "aparencia", "furto", "labia", "habilidadesmanuais", "militar",
    "naval", "habilidades"]

function returnAtb() {
    return ["nome", "altura", "idade", "peso", "profissao", "competencias", "equipamentos", "constituicao", "disposicao", "forca", "destreza", "sorte", "acrobacia",
    "inteligencia", "perspicacia", "carisma", "agilidade", "conhecimento", "furtividade", "percepcao", "sobrevivencia", "vontade", "magia", "sanidade", "linguas", "ciencias", "erudicao",
    "investigacao", "medicina", "mitosdocthulhu", "ocultismo", "oficio", "politica", "descricao", "imagem", "defeitos", "luta", "armasbrancas", "armasdefogo", "fadiga", "memoria",
    "lucidez", "extras", "vida", "encontrar", "escutar", "classe", "adestraranimais", "atletismo", "atuacao", "cavalgar", "cura", "diplomacia", "enganacao", "identificarmagias",
    "iniciativa", "intimidacao", "intuicao", "ladinagem", "obterinformacoes", "sabedoria", "nivel", "divindade", "deslocamento", "tendencia", "corpoacorpo", "ataquesadistancia",
    "armas", "armadura", "habilidadesderaca", "habilidadesdeclasse", "talentos", "dinheiro", "idiomas", "arcanismo", "blefar", "historia", "lidarcomanimais", "natureza",
    "persuasao", "prestidigitacao", "religiao", "classedaarmadura", "ligacoes", "fofura", "resistencia", "raca", "defesa", "escudo", "aparencia", "furto", "labia", "habilidadesmanuais", "militar",
    "naval", "habilidades"]
}

const atributosF = ["Nome", "Altura", "Idade", "Peso", "Profissão", "Competências", "Equipamentos", "Constituição", "Disposição", "Força", "Destreza", "Sorte", "Acrobacía",
    "Inteligência", "Perspicácia", "Carisma", "Agilidade", "Conhecimento", "Furtividade", "Percepção", "Sobrevivência", "Vontade", "Magía", "Sanidade", "Línguas", "Ciências", "Erudição",
    "Investigação", "Medicina", "Mitos do Cthulhu", "Ocultismo", "Ofício", "Política", "Descrição", "Imagem", "Defeitos", "Luta", "Armas brancas", "Armas de fogo", "Fadiga", "Memória",
    "Lucidez", "Extras", "Vida", "Encontrar", "Escutar", "Classe", "Adestrar Animais", "Atletismo", "Atuação", "Cavalgar", "Cura", "Diplomacia", "Enganação", "Identificar Magias",
    "Iniciativa", "Intimidação", "Intuição", "Ladinagem", "Obter Informações", "Sabedoria", "Nivel", "Divindade", "Desclocamento", "Tendência", "Corpo a Corpo", "Ataques a Distância",
    "Armas", "Armadura", "Habilidades de raça", "Habilidades de Classe", "Talentos", "Dinheiro", "Idiomas", "Arcanismo", "Blefar", "História", "Lidar com animais", "Natureza",
    "Persuasão", "Prestidigitação", "Religião", "Classe da Armadura", "Ligações", "Fofura", "Resistência", "Raça", "Defesa", "Escudo", "Aparência", "Furto", "Lábia", "Habilidades Manuais", "Militar",
    "Naval", "Habilidades"]

const atributosI1 = ["nome", "idade", "altura", "peso", "classe", "raca", "sanidade", "vida", "nivel", "dinheiro", "religiao", "divindade"]

const atributosIF1 = ["Nome", "Idade", "Altura", "Peso", "Classe", "Raça", "Sanidade", "Vida", "Nível", "Dinheiro", "Religião", "Divindade"]

const atributosI2 = ["profissao", "competencias", "defeitos", "equipamentos", "talentos", "habilidadesdeclasse", "habilidadesderaca", "habilidadesmanuais", "habilidades"]

const atributosIF2 = ["Profissão", "Competências", "Defeitos", "Equipamentos", "Talentos", "Habilidades de classe", "Habilidades de raça", "Habilidades Manuais", "Habilidades"]

const atributosStatus = ["disposicao", "destreza", "acrobacia", "perspicacia", "agilidade", "furtividade", "sobrevivencia", "magia", "linguas", "erudicao", "medicina", "ocultismo",
    "politica", "forca", "sorte", "inteligencia", "carisma", "conhecimento", "percepcao", "vontade", "ciencias", "investigacao", "oficio", "luta", "armasdefogo", "armasbrancas",
    "mitosdocthulhu", "fadiga", "lucidez", "memoria", "encontrar", "escutar", "constituicao", "adestraranimais", "atletismo", "atuacao", "cavalgar", "cura", "diplomacia", "enganacao",
    "identificarmagias", "iniciativa", "intimidacao", "intuicao", "ladinagem", "obterinformacoes", "sabedoria", "deslocamento", "tendencia", "corpoacorpo", "ataquesadistancia", "armas",
    "armadura", "idiomas", "arcanismo", "blefar", "historia", "lidarcomanimais", "natureza", "persuasao", "prestidigitacao", "classedaarmadura", "ligacoes", "fofura", "resistencia",
    "defesa", "escudo", "aparencia", "furto", "labia", "militar", "naval"]

const atributosStatusF = ["Disposição", "Destreza", "Acrobacia", "Perspicacia", "Agilidade", "Furtividade", "Sobrevivência", "Magia", "Línguas", "Erudição", "Medicina", "Ocultismo",
    "Política", "Força", "Sorte", "Inteligência", "Carisma", "Conhecimento", "Percepção", "Vontade", "Ciências", "Investigação", "Ofício", "Luta", "Armas de fogo", "Armas Brancas",
    "Mitos do Cthulhu", "Fadiga", "Lucidez", "Memória", "Encontrar", "Escutar", "Constiuição", "Adestrar animais", "Atletismo", "Atuação", "Cavalgar", "Cura", "Diplomacia", "Enganação",
    "Identificar Magias", "Iniciativa", "Intimidação", "Intuição", "Ladinagem", "Obter Informações", "Sabedoria", "Desclocamento", "Tendência", "Corpo a Corpo", "Ataques a Distância",
    "Armas", "Armadura", "Idiomas", "Arcanismo", "Blefar", "História", "Lidar com animais", "Natureza", "Persuasão", "Prestidigitação", "Classe da Armadura", "Ligações", "Fofura",
    "Resistência", "Defesa", "Escudo", "Aparência", "Furto", "Lábia", "Militar", "Naval"]

function footer() {
    return `${new Date().getFullYear()} © Kami`
}

function secret() {
    const secret = ["Comando secreto, somente os mais inteligentes saberão o resultado", "Coisas estão rolando sem ninguém saber 👀", "Tenho a leve impressão que alguém vai entrar em apúros logo logo", "Confiem em mim, é melhor vocês não saberem o resultado mesmo",
        "Nossa, eu to até com dó depois dos dados que caíram aqui", "Ou, esse resultado aqui vai valer pra quem? Só pra eu dar meus pêsames"]

    return randomChoice(secret)
}

const inPerm = ["Pesadelos", "Ataques de pânico", "Delírios", "Tremores corporais", "Acessos de fúria", "Catatonia", "Cegueira", "Esquizofrenia", "Psicose",
    "Mútiplas personalidades", "Piromania", "Fobia gravíssima", "Síndrome de Capgras", "Prosopgnosia"]

const inTemp = ["Desmaia imediatamente", "Começa a gritar sem parar e fica imobilizado", "Foge em pânico", "Começa a gargalhar de desespero", "Sente um medo incontrolável e fica paralisado",
    "Alucinação horrenda relacionada com a situação",
    "Sem ação e totalmente sugestionável, perde a vontade própria", "Delírio", "Cai no chão e assume posição fetal, ignorando eventos", "Começa a comer algo estranho",
    "Começa a falar rápido coisas sem sentido", "Chora compulsivamente em desespero",
    "Acha que é poderoso e que pode fazer qualquer coisa", "Perde a fala", "Perde a audição", "Perde a visão",
    "Vê seus aliados como mortos vivos", "Vê seus braços se transformando em tentáculos",
    "Começa a rezar compulsivamente", "Esquece a própria identidade", "Esquece o idioma que fala", "Não reconhece nenhum aliado, considera todos como inimigos",
    "Reconhece o inimigo como seu melhor amigo", "Olha para seus aliados e acha que eles são a sua mãe ou seu pai", "Infantilismo, reverte a idade mental para a idade de 3 anos",
    "Não consegue respirar direito, fica tonto e se movimenta lentamente",
    "Anda em círculos falando compulsivamente", "Começa a suar e a piscar sem parar, enquanto o corpo treme incontroladamente",
    "Tem sua face tomada por um tique nervoso incontrolável", "Abraça a si mesmo, fecha os olhos e grita sem parar que tudo é apenas um pesadelo e que ele vai acordar a qualquer hora",
    "Abraça um aliado e não larga enquanto a insanidade durar", "Começa a cantar uma música de infância enquanto chora morrendo de medo",
    "Começa a reviver uma cena a infância com seu pai ou mãe", "Tem amnésia e esquece quem é e o que está fazendo ali", "As pernas tremem sem parar e tem dificuldade de andar ou de ficar em pé",
    "Escuta as batidas do próprio coração como sons ensurdecedores", `Grita "tudo está perdido!" e se joga no chão berrando e chorando`,
    `Fecha os olhos e diz "isso é tudo um sonho!" e acredita que pode fazer tudo desaparecer com a mente`, "Olha seus aliados e vê como monstros horrendos",
    "Acredita que seus pés estão colados no chão e não consegue tirá-los de onde está",
    "Começa a ouvir todos os sons de forma ensurdecedora", "Começa a achar todos os cheiros insuportáveis",
    "Fica com cores fortíssimas em tudo que vê e ele não consegue mais ficar com os olhos abertos", "Acha que o chão ganha uma consistência líquida e ele sente que está afundando, como em areia movediça",
    "Começa a conversar com si mesmo, tentando convencer a si mesmo de que não está louco",
    "Cai no chão de joelhos e levanta as mãos para o céu pedindo perdão",
    "É acometido por dores de cabeça fortíssimas e enlouquecedoras", "vê tudo enevoado, ele vê tudo como se fosse em uma neblina forte, esfregando os olhos para ver se consegue clarear a visão",
    "Começa a falar desesperado em uma língua inventada que ninguém entende",
    "Tem uma vertigem fortíssima e vê que está tudo rodando, como se estivesse bêbado", "Vê runas místicas surgindo em todo o seu corpo, cobrindo sua pele",
    "Vê alguém que morreu em sua família aparecer na distância e acenar para ele",
    "Abre a boca e fica gritando porém nenhum som sai de sua boca", "Se desliga do presente e experiência uma memória feliz do passado como se estivesse acontecendo agora",
    "Entra em um frenesi de fúria e ataca seus aliados",
    "Sente que o corpo todo está anestesiado e difícil de mover", "Sente calafrios horrendos na espinha, que o fazem mover o seu corpo violentamente",]


module.exports = {
    permissoes,
    atributos,
    atributosF,
    atributosI1,
    atributosIF1,
    atributosI2,
    atributosIF2,
    atributosStatus,
    atributosStatusF,
    footer,
    secret,
    inPerm,
    inTemp,
    returnAtb
}