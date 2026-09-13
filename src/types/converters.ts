function toUser_Config(data: any): User_Config {
    return {
        id: data.id,
        user_id: data.user_id,
        language: data.language
            ? (`${data.language}`.toLowerCase().replace('_', '-') as Available_Languages)
            : Available_Languages['en-us'],
        secret_roll: data.secret_roll,
        secret_insan: data.secret_insan,
        secret_general: data.secret_general,
        secret_sheet: data.secret_sheet,
        secret_send: data.secret_send
    };
}

export { toUser_Config };
