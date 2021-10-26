

export const generateRandomDigits = (n: number) => {
    return Math.floor(Math.random() * (9 * (Math.pow(10, n - 1)))) + (Math.pow(10, n - 1));
};

export const epochToDate = (epochs: number) => {
    const d = new Date(0);
    d.setUTCSeconds(epochs);

    return d;
};


export const addHours = (hours: number, refDate?: Date) => {
    const now = refDate ? refDate : new Date();
    let time = now.getTime();
    time += (hours * 60 * 60 * 1000);
    const dt = new Date(time);
    return dt;
};

export const extractDate = (dt: Date) => {
    const date = dt.getDate();
    const month = dt.getMonth() + 1;
    const year = dt.getFullYear();

    const dateS = date < 10 ? `0${date}` : `${date}`;
    const monthS = month < 10 ? `0${month}` : `${month}`;

    const dateString = `${year}-${monthS}-${dateS}`;
    return dateString;

};

export const getDayStart = (dt?: Date) => {
    dt = dt || new Date();
    const today = new Date(dt.setUTCHours(0, 0, 0, 0));
    return today;
};

export const getDayEnd = (dt?: Date) => {
    dt = dt || new Date();
    const dayEnd = new Date(dt.setUTCHours(23, 59, 59, 999));
    return dayEnd;
};

export const isPrimitive = (test: any) => {
    return test !== Object(test);
};

export const isPlainObj = (o: any) => {
    let result = o && o.constructor && o.constructor.prototype && o.constructor.prototype.hasOwnProperty("isPrototypeOf");
    result = Boolean(result);
    return result;
};

export const flattenObj = (obj: any, keys: string[] = []): any => {
    return Object.keys(obj).reduce((acc, key) => {
        const check = isPlainObj(obj[key]) || (!isPrimitive(obj[key]));
        return Object.assign(acc, check
            ? flattenObj(obj[key], keys.concat(key))
            : { [keys.concat(key).join(".")]: obj[key] }
        );
    }, {});
};


export const inject = (str: string, obj: any) => str.replace(/\${(.*?)}/g, (x, g) => obj[g]);


export const genRandomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");


export const extractFields = <T>(o: T, data: any): T => {

    if (!data) {
        return o;
    }

    const obj = o as any;
    for (const k of Object.keys(obj)) {
        if (data[k]) {

            const val = data[k];
            const myval = obj[k];

            if (isPlainObj(myval)) {
                const res = extractFields(myval, val);
                obj[k] = res;
                continue;
            }

            obj[k] = data[k];
        }
    }

    obj.id = obj._id || obj.id;

    o = obj;
    return o;
};

export const isString = (o: any) => {
    const result = typeof o === "string" || o instanceof String;
    return result;
};



export const checkParams = (param: any, item: any): boolean => {
    const condKeys = Object.keys(param);

    for (const k of condKeys) {
        const itemVal = item[k];
        const condVal = param[k];
        if (itemVal === undefined || itemVal === null) {
            continue;
        }

        if (!(itemVal === condVal)) {
            return false;
        }
    }

    return true;
};

export const checkParamDeep = (param: any, item: any): boolean => {

    const condKeys = Object.keys(param);

    let res = true;

    for (const k of condKeys) {
        let itemVal = item[k];
        let condVal = param[k];

        if (itemVal === undefined || itemVal === null) {
            continue;
        }

        if (isString(condVal)) {
            if (condVal === "") {
                continue;
            }
            itemVal = String(itemVal);
            itemVal = itemVal.toLowerCase();
            condVal = condVal.toLowerCase();

            res = res && itemVal.includes(condVal);
            continue;
        }


        if (condVal instanceof Array) {
            if (condVal.length === 0) {
                continue;
            }

            condVal = condVal.map((item) => String(item).toLowerCase());

            if (!(itemVal instanceof Array)) {
                itemVal = String(itemVal);
                itemVal = itemVal.toLowerCase();

                res = res && condVal.includes(itemVal);
                continue;
            }

            let any = false;
            for (let v of itemVal) {
                v = String(v);
                v = v.toLowerCase();
                any = any || condVal.includes(v);
            }

            res = res && any;
            continue;

        }

        if (!(itemVal === condVal)) {
            res = res && false;
            continue;
        }
    }

    return res;
};

export const sortObjectKeys = (inputObj: any): any => {
    return Object.keys(inputObj).sort().reduce(
        (obj: any, key: any) => {
            obj[key] = inputObj[key];
            return obj;
        },
        {}
    );
};