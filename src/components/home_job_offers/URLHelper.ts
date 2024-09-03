import {defaultQueryParams, QueryParams} from "../../models/QueryParams";

const buildURL = (params: QueryParams) => {
    let url = "/jobs?";

    if (params.search && params.search !== defaultQueryParams.search) {
        url += "q=" + params.search +  "&";
    }

    if (params.languages && params.languages.join(',') !== defaultQueryParams.languages.join(',')) {
        url += "languages=" + params.languages.join(',') + "&";
    }

    if (params.minCredits && params.minCredits !== defaultQueryParams.minCredits) {
        url += "minCredits=" + params.minCredits + "&";
    }

    if (params.maxCredits && params.maxCredits !== defaultQueryParams.maxCredits) {
        url += "maxCredits=" + params.maxCredits + "&";
    }

    if (params.minSalary && params.minSalary !== defaultQueryParams.minSalary) {
        url += "minSalary=" + params.minSalary + "&";
    }

    if (params.maxSalary && params.maxSalary !== defaultQueryParams.maxSalary) {
        url += "maxSalary=" + params.maxSalary + "&";
    }

    if (params.sort && params.sort !== defaultQueryParams.sort) {
        url += "sort=" + params.sort + "&";
    }

    if (params.minOpensIn && params.minOpensIn !== defaultQueryParams.minOpensIn) {
        url += "minOpensIn=" + params.minOpensIn + "&";
    }

    if (params.maxOpensIn && params.maxOpensIn !== defaultQueryParams.maxOpensIn) {
        url += "maxOpensIn=" + params.maxOpensIn + "&";
    }

    if (params.cities && params.cities.join(',') !== defaultQueryParams.cities.join(',')) {
        url += "cities=" + params.cities.join(',') + "&";
    }

    if (params.countries && params.countries.join(',') !== defaultQueryParams.countries.join(',')) {
        url += "countries=" + params.countries.join(',') + "&";
    }

    if ((params.page) && params.page !== defaultQueryParams.page) {
        url += "page=" + params.page + "&";
    }
    console.log(params.page)
    url = url.endsWith("&") ? url.slice(0, -1) : url;
    return url;
};

export { buildURL };
