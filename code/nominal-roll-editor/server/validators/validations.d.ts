declare const _default: {
    recordSchema: {
        'record_id': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtras: {
                errorMessage: string;
            };
        };
        'soldier_units': {
            optional: {
                checkFalsy: boolean;
            };
            isSoldierUnitArray: {
                errorMessage: string;
            };
        };
        'soldier_surname': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtras: {
                errorMessage: string;
            };
        };
        'soldier_firstname': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtras: {
                errorMessage: string;
            };
        };
        'soldier_middlenames': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtrasArray: {
                errorMessage: string;
            };
        };
        'soldier_serial_number': {
            optional: {
                checkFalsy: boolean;
            };
            isNumOrNullArray: {
                errorMessage: string;
            };
        };
        'kia': {
            optional: {
                checkFalsy: boolean;
            };
            isKSU: {
                errorMessage: string;
            };
        };
        'kiaDate': {
            optional: {
                checkFalsy: boolean;
            };
            isDate: {
                errorMessage: string;
            };
        };
        'batch': {
            optional: {
                checkFalsy: boolean;
            };
            isNumber: {
                errorMessage: string;
            };
        };
    };
    unitSchema: {
        'unit_id': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtras: {
                errorMessage: string;
            };
        };
        'unit_name': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtras: {
                errorMessage: string;
            };
        };
        'batch': {
            optional: {
                checkFalsy: boolean;
            };
            isNumber: {
                errorMessage: string;
            };
        };
    };
    rollSchema: {
        '_id': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtras: {
                errorMessage: string;
            };
        };
        'unit_name': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtras: {
                errorMessage: string;
            };
        };
        'periodFrom': {
            optional: {
                checkFalsy: boolean;
            };
            isDate: {
                errorMessage: string;
            };
        };
        'periodTo': {
            optional: {
                checkFalsy: boolean;
            };
            isDate: {
                errorMessage: string;
            };
        };
        'type': {
            optional: {
                checkFalsy: boolean;
            };
            isRollType: {
                errorMessage: string;
            };
        };
    };
    userSchema: {
        'fullName': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtras: {
                errorMessage: string;
            };
        };
        'email': {
            notEmpty: boolean;
            optional: {
                checkFalsy: boolean;
            };
            isEmail: {
                errorMessage: string;
            };
        };
        'password': {
            notEmpty: boolean;
            optional: {
                checkFalsy: boolean;
            };
            isAcceptablePassword: {
                errorMessage: string;
            };
        };
        'role': {
            notEmpty: boolean;
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtrasArray: {
                errorMessage: string;
            };
        };
        'tokenCounter': {
            optional: {
                checkFalsy: boolean;
            };
            isNumber: {
                errorMessage: string;
            };
        };
        'revokedTokens': {
            optional: {
                checkFalsy: boolean;
            };
            isTokenArray: {
                errorMessage: string;
            };
        };
    };
    administrationSchema: {
        'dummy': {
            optional: {
                checkFalsy: boolean;
            };
            isAlphaNumericPlusExtras: {
                errorMessage: string;
            };
        };
    };
};
export = _default;
