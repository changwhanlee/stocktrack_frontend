import Cookie from "js-cookie";
import { QueryClientContext, QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { isNoSubstitutionTemplateLiteral } from "typescript";

const instance = axios.create({
    baseURL: 
        process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/v1"
            : "https://stocktrack-j0vu.onrender.com/api/v1",
    withCredentials: true
})

export const getMe = () =>
    instance.get('users/me').then((response) => response.data);

export const logOut = () =>
    instance.post('users/log-out', null, {
        headers: {
            "X-CSRFToken" : Cookie.get("csrftoken") || "",
        },
    }).then((response) => response.data);

export const githubLogin = (code: string) => 
    instance.post(
        'users/github', 
        {code},
        {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        }
    )
    .then((response) => response.status);

export const kakaoLogin = (code: string) => instance.post(
    'users/kakao', 
        {code},
        {
            headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
            },
        }
    )
    .then((response) => response.status);


export interface IUsernameLoginVariables {
    username: string;
    password: string;
}

export interface IUsernameLoginSuccess {
    ok: string;
}
export interface IUsernameLoginError {
error: string;
}
  
export const usernameLogIn = ({
    username,
    password,
}: IUsernameLoginVariables) => instance.post(
    'users/log-in',
    {username, password},
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
    }
)
.then((response) => response.data)


export interface IUsernameSignupVariables {
    name : string;
    email : string;
    username: string;
    password: string;
}


export const usernameSignUp = ({
    name,
    email,
    username,
    password,
}: IUsernameSignupVariables) => instance.post(
    'users/',
    {name, email, username, password},
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
    }
).then((response) => response.data)

export const getTotalAsset = () => instance.get(
    "total_asset/categories_list"
).then((response) => response.data)

export const getCategoryName = () =>
    instance.get('total_asset/categories_name').then((response) => response.data);

export interface IRegisterStockVariales {
    name: string;
    ticker: string;
    currency: string;
    category: string;
    date: string;
    amount: number;
    price:number;
}

export const createStock = (variables: IRegisterStockVariales) => instance.post(
    'stocks/create',
    variables,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
    }
).then((response) => response.data)

export const getstock = ({ queryKey }: QueryFunctionContext) => {
    const [, categoryPk, stockPk] = queryKey; // 첫 번째 요소는 카테고리 식별자가 아니므로 무시합니다.
    console.log(queryKey);
    console.log(categoryPk);
    console.log(stockPk);
    return instance.get(`stocks/get/${categoryPk}/${stockPk}`).then((response) => response.data);
}

export interface IRegisterStockTransaction {
    amount : number;
    price: number;
    date: string;
    stockPk: string;
    categoryPk: string;
}



export const createStockTransaction = (variables: IRegisterStockTransaction) => instance.post(
    'stocks/create/stock_transaction',
    variables,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
    }
).then((response) => response.data)

export const readCategoryStocks = ({queryKey} :  QueryFunctionContext) => {
    const [, categoryPk] = queryKey;
    return instance.get(`stocks/${categoryPk}`).then((response) => response.data)    
}

export interface IRegisterCategory {
    name: string;
    classification: string;
}

export const createCategory = (variables: IRegisterCategory) => instance.post(
    'total_asset/categories_list',
    variables,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
    }
).then((Response) => Response.data)

export const getDateUpdate = () => instance.get(
    "total_asset/update_date"
).then((response) => response.data)


export const getCategoryStockCount = () => instance.get(
    "total_asset/category_count"
).then((response) => response.data)

export const getTransUpdate = () => instance.get(
    "total_asset/update_trans"
).then((response) => response.data)

export const getCategoryStockTable = ({ queryKey }: QueryFunctionContext) => {
    const [, categoryPk] = queryKey; // 첫 번째 요소는 카테고리 식별자가 아니므로 무시합니다.
    console.log(queryKey);
    console.log(categoryPk);
    return instance.get(`stocks/${categoryPk}/stockTable`).then((response) => response.data);
}

export const getStockTransaction = ({queryKey} : QueryFunctionContext) => {
    const [, transPk] = queryKey;
    console.log(transPk)
    return instance.get(`stocks/modify/stock_transaction/${transPk}`).then((response) => response.data);
}

export interface IModifyStockTrans {
    id : number;
    amount : number;
    price : number;
}

export const ModifyStockTransaction = (variables : IModifyStockTrans) => instance.put(
    `stocks/modify/stock_transaction/${variables.id}`,
    variables,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
    }
).then((response) => response.data)

export const getCategoryBanks = () => instance.get(
    "cash"
).then((response) => response.data)


export const getBank = ({queryKey} : QueryFunctionContext) => {
    const [, categoryPk] = queryKey;
    return instance.get(`cash/get/${categoryPk}`).then((response) => response.data);
}

export const getBankDetail = ({queryKey} : QueryFunctionContext) => {
    const [, categoryPk] = queryKey;
    return instance.get(`cash/${categoryPk}`).then((response) => response.data);
};

export interface IRegisterBank {
    name: string,
    currency : string,
    date: string,
    money: string,
}

export const createBank = (variables: IRegisterBank) => instance.post(
    'cash/create',
    variables,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
    }
).then((response) => response.data)


export interface IRegisterBankTransaction {
    id : string;
    date: string;
    money: number;
}

export const createBankTrans = (variables: IRegisterBankTransaction) => instance.post(
    `cash/get/${variables.id}`,
    variables,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
    }
).then((response) => response.data)

export const getBankTransaction = ({queryKey} : QueryFunctionContext) => {
    const [, transPk] = queryKey;
    return instance.get(`cash/modify/${transPk}`).then((response) => response.data);
}


export interface IModifyBankTrans {
    id : number;
    money : number;
}

export const ModifyBankTransaction = (variables : IModifyBankTrans) => instance.put(
    `cash/modify/${variables.id}`,
    variables,
    {
        headers: {
            "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
    }
).then((response) => response.data)