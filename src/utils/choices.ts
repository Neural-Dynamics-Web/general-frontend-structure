export enum Sex { 
    "male" = 1,
    "female"
}

export enum Languages { 
    en = "English",
    ru = "Русский",
    uk = "Українська"
}

export enum ProjectsStatuses { 
    "На проверке" = 1,
    "Не оплачен",
    "Оплачен",
    "Приостановлен администратором",
    "Активен",
    "Приостановлен"
}

export enum UserBlackListTypes { 
    "Заблокировал исполнителя" = 1,
    "Заблокировал заказчика",
    "Заблокировал личные сообщения",
}

export enum ProjectBlackListTypes { 
    "Отказ от проекта из-за низкой стоимости" = 1,
    "Проект в чёрном списке"
}

export enum ExamTypes { 
    didnt_pass = 1,
    checking,
    passed,
    failed
}

export enum ProjectTypes {
    review = 1, 
    actions,
    subs, 
    watch, 
    seo
}

export default {
    Sex,
    Languages,
    ProjectsStatuses,
    UserBlackListTypes,
    ProjectBlackListTypes,
    ProjectTypes,
    ExamTypes
}