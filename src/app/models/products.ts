export class AddProductRequest {
    constructor(
      public name: string = '',
      public description: string = '',
      public productImages: string[] = [],
      public categories: string[] = [],
      public mainImage: string = '',
      public price: Price =  new Price(),
      public availableSizes: AvailableSizes = new AvailableSizes(),
    ) { }
}

export interface AddProductRequest {
    name:           string;
    description:    string;
    mainImage:      string;
    productImages:  string[];
    categories:     string[];
    price:          Price;
    availableSizes: AvailableSizes;
}


export class AvailableSizes {
    constructor(
      public xxs: number = 0,
      public xs: number = 0,
      public s: number = 0,
      public m: number = 0,
      public l: number = 0,
      public xl: number = 0,
      public xxl: number = 0,
      public os: number = 0,
    ) { }
}

export interface AvailableSizes {
    xxs: number;
    xs:  number;
    s:   number;
    m:   number;
    l:   number;
    xl:  number;
    xxl: number;
    os:  number;
}


export class Price {
    constructor(
      public usd: number = 0,
      public rub: number = 0,
      public byn: number = 0,
      public eur: number = 0,
    ) { }
}
export interface Price {
    usd: number;
    rub: number;
    byn: number;
    eur: number;
}




export class ProductForm {
    constructor(
      public mainImage: string = '',
      public productImages: string = '',
      public name: string = '',
      public usd: string = '',
      public byn: string = '',
      public rub: string = '',
      public eur: string = '',
      public xxs: string = '',
      public xs: string = '',
      public s: string = '',
      public m: string = '',
      public l: string = '',
      public xl: string = '',
      public xxl: string = '',
      public description: string = '',
      public categories: string = '',
    ) { }
}

export interface ProductForm {
    mainImage:     string;
    productImages: string;
    name:          string;
    usd:           string;
    byn:           string;
    rub:           string;
    eur:           string;
    xxs:           string;
    xs:            string;
    s:             string;
    m:             string;
    l:             string;
    xl:            string;
    xxl:           string;
    os:             string;
    description:   string;
    categories:    string;
}

export function forceCast<ProductForm>(input: any): ProductForm {  
    // @ts-ignore <-- forces TS compiler to compile this as-is
    return input;
  }



export class Convert {
    public static  ProductFormToAddProductRequest(json: string,imgs: string[], img: string): AddProductRequest {
        const form = forceCast<ProductForm>(json);
        const price = new Price(Number(form.usd),Number(form.rub),Number(form.byn),Number(form.eur))
        const sizes = new AvailableSizes(Number(form.xxs),Number(form.xs),Number(form.s),Number(form.m),Number(form.l),Number(form.xl),Number(form.xxl),Number(form.os))
        return new AddProductRequest(form.name,form.description,imgs,form.categories.split(" "),img,price,sizes)
    }
}

