class QueryParams {
    languages: string[];
    minCredits: number;
    maxCredits: number;
    minSalary: number;
    maxSalary: number;
    minOpensIn: Date;
    maxOpensIn: Date;
    search: string;
    sort: string;
    page: number;
    cities: string[];
    countries: string[];

    constructor(
        languages: string[] = [],
        minCredits: number = 0,
        maxCredits: number = 1000,
        minSalary: number = 0,
        maxSalary: number = 40000,
        search: string = "",
        sort: string = "opensIn,asc",
        page: number = 0,
        minOpensIn: Date = new Date(),
        maxOpensIn: Date = (() => {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            return date;
        })(),
        cities: string[] = [],
        countries: string[] = []
    ) {
        this.languages = languages;
        this.minCredits = minCredits;
        this.maxCredits = maxCredits;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
        this.minOpensIn = minOpensIn;
        this.maxOpensIn = maxOpensIn;
        this.search = search;
        this.sort = sort;
        this.page = page;
        this.cities = cities;
        this.countries = countries;
    }
}

const defaultQueryParams = new QueryParams();

export { QueryParams, defaultQueryParams };
