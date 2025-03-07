interface Photo {
    id: number;
    path: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    city_id: string | null;
    phone: string | null;
    email_verified_at?: string | null;
}

interface Ad {
    id: number;
    name: string;
    description: string;
    category: string | null;
    price: number;
    city: CityAd;
    photos: Photo[];
    user: User;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

interface Filters {
    filters: {
        name?: string;
        category_id?: number;
        region_id: number;
        city_id: number;
    };
    sort: {
        field: string;
        direction: "asc" | "desc";
    };
    page: string;
    per_page: string;
}

interface AdsResponse {
    data: Ad[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

interface CreateAdFormData {
    name: string;
    description: string;
    category: string;
    price: string;
    city_id: string;
    photos: File[];
    [key: string]: string | File[];
}

interface CategoryImg {
    id: number;
    path: string;
}

interface ICategory {
    id: number;
    name: string;
    img?: ICategoryImg;
}

interface ICategoryImg {
    id: number;
    path: string;
}

interface City {
    id: number;
    name: string;
    region_id: number;
    type: string;
    created_at?: string;
    updated_at?: string;
}

interface Region {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    cities: City[];
}

interface CityAd {
    id: number;
    name: string;
    region: RegionAd;
}

interface RegionAd {
    id: number;
    name: string;
}
