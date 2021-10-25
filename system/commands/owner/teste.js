module.exports = class teste {
  constructor() {
    return {
      perm: {
        bot: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
        user: [],
        owner: true,
      },
      name: "teste",
      cat: "Teste",
      desc: 'Comando para testar scripts.',
      aliases: ["t", "test"],
      run: this.execute
    }
  }
  async execute(client, msg) {

  }
}