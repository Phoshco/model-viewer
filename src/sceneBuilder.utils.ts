// Pure helpers shared by sceneBuilder.ts.
export const decodePathItem = (str: string): string => {
    try {
        return decodeURIComponent(str);
    } catch {
        return str.replace(/%20/gi, " ");
    }
};

export const normalize = (str: string): string =>
    decodePathItem(str)
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "");

export const createCharacterSlug = (str: string): string =>
    normalize(str).trim().replace(/ +/g, " ").replace(/ /g, "%20");

export const getFirstDigit = (num: number): number => {
    const str = Math.abs(num).toString();
    return parseInt(str[0], 10);
};

export const findCharByName = <T extends { name: string }>(jsonData: T[], nameToFind: string): T | undefined =>
    jsonData.find((item) => item.name === nameToFind);

export const findCharById = <T extends { id: number }>(jsonData: T[], idToFind: number): T | undefined =>
    jsonData.find((item) => item.id === idToFind);

export const findAllCharsByName = <T extends { name: string }>(jsonData: T[], nameToFind: string): T[] =>
    sortBy(jsonData.filter((item) => item.name === nameToFind), "name", false);

export function filterBy<T>(
    dataArray: T[],
    filters: { key: keyof T; value: string }[]
): T[] {
    return dataArray.filter((data) =>
        filters.every((filter) => {
            const propertyValue = String(data[filter.key]);
            return propertyValue.includes(filter.value);
        })
    );
}

export function sortBy<T>(
    dataArray: T[],
    sortByKey: keyof T,
    sortAscending: boolean = true
): T[] {
    return dataArray.slice().sort((a, b) => {
        const valueA = a[sortByKey];
        const valueB = b[sortByKey];

        if (typeof valueA === "number" && typeof valueB === "number") {
            return sortAscending ? (valueA as number) - (valueB as number) : (valueB as number) - (valueA as number);
        } else {
            const strA = String(valueA);
            const strB = String(valueB);
            return sortAscending ? strB.localeCompare(strA) : strA.localeCompare(strB);
        }
    });
}
