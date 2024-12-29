const translationStrings = import.meta.glob('./app/translations/*.json', {
    query: '?raw',
    import: 'default',
});
const toFlatPropertyMap = (obj: any, keySeparator = '.') => {
    const flattenRecursive = (obj: any, parentProperty?: string, propertyMap: Record<string, unknown> = {}) => {
        for (const [key, value] of Object.entries(obj)) {
            const property = parentProperty ? `${parentProperty}${keySeparator}${key}` : key;
            if (value && typeof value === 'object') {
                flattenRecursive(value, property, propertyMap);
            } else {
                propertyMap[property] = value;
            }
        }
        return propertyMap;
    };
    return flattenRecursive(obj);
};

export default async (language: string) => {
    return toFlatPropertyMap(await translationStrings[language]);
};
