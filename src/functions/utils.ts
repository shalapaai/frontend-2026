function generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomPart}`;
}

function isColorHash(value: string): boolean {
    return /^#[0-9A-Fa-f]{6}$/.test(value);
}

// https://github.com/funbox/diamonds/blob/master/lib/deep-clone.ts
type DeepCloneSupportedType = boolean | number | bigint | string | undefined | null | Date | IDeepCloneSupportedTypeObject | IDeepCloneSupportedTypeArray;

interface IDeepCloneSupportedTypeObject {
    [x: string]: DeepCloneSupportedType;
}

interface IDeepCloneSupportedTypeArray extends Array<DeepCloneSupportedType> { }

function deepClone<T extends DeepCloneSupportedType>(obj: T): T;
function deepClone(obj: DeepCloneSupportedType): DeepCloneSupportedType {
    if (obj == null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        const copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    if (obj instanceof Array) {
        const copy: IDeepCloneSupportedTypeArray = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i]);
        }
        return copy;
    }

    const copy: typeof obj = {};

    Object.keys(obj).forEach(key => {
        copy[key] = deepClone(obj[key]);
    });

    return copy;
}

export { 
    generateId,
    isColorHash,
    deepClone
}