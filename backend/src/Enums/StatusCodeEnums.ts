type EnumDictionary<T extends string | symbol | number, U> = {
    [K in T]: U;
};

enum StatusCodeEnums {
    NAME_REQUIRED = 10000,
    UUID_REQUIRED,
    EMAIL_REQUIRED,
    PASSWORD_REQUIRED,
    DATA_REQUIRED,

    INVALID_CREDENTIALS = 10100,

    PRODUCT_CREATION_ERROR = 20000,
    PRODUCT_NOT_FOUND,
    PRODUCT_FIND_ERROR,
    PRODUCT_EXISTS,
    PRODUCT_UPDATE_ERROR,
    PRODUCT_DELETE_ERROR,

    USER_ALREADY_EXISTS = 30000,
    USER_CREATE_ERROR,
    USER_NOT_FOUND,

    ROLE_NOT_FOUND = 40000,
}

type StatusCodeKeys = keyof typeof StatusCodeEnums;

const sortedKeys: StatusCodeKeys[] = (Object.keys(StatusCodeEnums) as StatusCodeKeys[]).sort((a, b) => StatusCodeEnums[a] - StatusCodeEnums[b]);

const SortedStatusCodeExceptionText: EnumDictionary<StatusCodeKeys, string> = {} as EnumDictionary<StatusCodeKeys, string>;

for (const key of sortedKeys) {
    SortedStatusCodeExceptionText[key] = String(StatusCodeEnums[key]);
}

export { StatusCodeEnums, SortedStatusCodeExceptionText };