enum Ban_Type {
    TEMPORARY = 'TEMPORARY',
    PERMANENT = 'PERMANENT',
    UNBANNED = 'UNBANNED',
}

enum Available_Languages {
    PT_BR = 'pt_br',
    EN_US = 'en_us',
}

enum Section_Type {
    STANDARD = 0,
    DESCRIPTION = 1,
}

enum Attribute_Type {
    TEXT = 0,
    NUMBER = 1,
    IMAGE = 2,
    LIST = 3,
    BAR = 4,
}

enum Macro_Type {
    NORMAL = 0,
    MODIFIER_PLUS = 1,
    MODIFIER_MINUS = 2,
}

enum Bot_Command_Type {
    TEXT = 'TEXT',
    BUTTON = 'BUTTON',
    CONTEXT = 'CONTEXT'
}

export {
    Ban_Type,
    Available_Languages,
    Section_Type,
    Attribute_Type,
    Macro_Type,
    Bot_Command_Type
}