// src/store/books/books.types.ts
export interface BookType {
  id: number;
  libraryId: number;
  categoryId: number;
  authorId: number;
  name: string;
  title: string;
  img: string;
  description: string;
  page?: number;

  quantity: number; // ✅ NEW

  library: {
    id: number;
    name: string;
    contact: string;
    address: string;
    location: string;
    lat: number;
    lon: number;
  };

  category: {
    id: number;
    categoryName: string;
    desc: string;
  };

  author: {
    id: number;
    name: string;
    img: string;
    desc: string;
  };
}
