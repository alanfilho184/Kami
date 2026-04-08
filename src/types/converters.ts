function toBot_Command_Statistic(data: any): Bot_Command_Statistic {
    return {
        id: data.id,
        name: data.name,
        type: data.type,
        usage_total_count: data.usage_total_count,
        usage_record: data.usage_record
    }
}

function toUser_Config(data: any): User_Config {
    return {
        id: data.id,
        user_id: data.user_id,
        language: data.language,
        secret_roll: data.secret_roll,
        secret_insan: data.secret_insan,
        secret_general: data.secret_general,
        secret_sheet: data.secret_sheet,
        secret_send: data.secret_send
    }
}

export { toBot_Command_Statistic, toUser_Config }