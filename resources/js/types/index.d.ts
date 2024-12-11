interface Photo {
    id: number;
    path: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    city: string;
    phone: string;
}

interface Ad {
    id: number;
    name: string;
    description: string;
    category: string | null;
    price: number;
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
    photos: FileList | null;
    price: string;
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
