import { useEffect, useMemo, useState } from "react";
import { Skeleton, Row, Col, Button, Input, message } from "antd";
import { Link } from "react-router-dom";
import {
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
  BookOutlined,
  UserOutlined,
  TagOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import { fetchCategories } from "../../store/category/category.slice";
import { fetchBooks } from "../../store/books/books.slice";
import {
  fetchSavedBooks,
  saveBookToBackend,
  unsaveBookFromBackend,
} from "../../store/savedBooks/savedBooks.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import {
  CategoryWrapper,
  CategoryGrid,
  CategoryCard,
  CategoryTitle,
  CategoryDesc,
  CountText,
  BooksSection,
  BooksGrid,
  TopRow,
  SearchWrapper,
  BookCard,
  BookContent,
  BookImg,
  BookTitle,
  BookMeta,
  BookActions,
} from "./Category.styled";

const PLACEHOLDER = "https://via.placeholder.com/300x400?text=No+Image";
const safe = (v: any) => String(v ?? "");

export default function Category() {
  const dispatch = useAppDispatch();

  const { data: categories, loading: catLoading } = useAppSelector(
    (state) => state.category,
  );
  const { data: books, loading: booksLoading } = useAppSelector(
    (state) => state.books,
  );

  const { savedBooks, loading: savedLoading } = useAppSelector(
    (state) => state.savedBooks,
  );

  const userId = Number(localStorage.getItem("userId"));

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [savingBookId, setSavingBookId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBooks({ page: 1, limit: 1000 }));

    if (Number.isFinite(userId) && userId > 0) {
      dispatch(fetchSavedBooks(userId));
    }
  }, [dispatch, userId]);

  const getBookCategoryId = (b: any) =>
    Number(b?.categoryId ?? b?.category?.id ?? NaN);

  const booksCountByCategory = useMemo(() => {
    const map = new Map<number, number>();
    (Array.isArray(books) ? books : []).forEach((b: any) => {
      const cid = getBookCategoryId(b);
      if (!Number.isFinite(cid)) return;
      map.set(cid, (map.get(cid) ?? 0) + 1);
    });
    return map;
  }, [books]);

  const filteredCategories = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return list.filter(
      (c: any) => (booksCountByCategory.get(Number(c?.id)) ?? 0) > 0,
    );
  }, [categories, booksCountByCategory]);

  const selectedCategory = useMemo(() => {
    if (selectedCategoryId === null) return null;
    return (
      (Array.isArray(categories) ? categories : []).find(
        (c: any) => Number(c?.id) === Number(selectedCategoryId),
      ) || null
    );
  }, [categories, selectedCategoryId]);

  const displayedBooks = useMemo(() => {
    if (selectedCategoryId === null) return [];
    const list = Array.isArray(books) ? books : [];
    const cid = Number(selectedCategoryId);
    const term = safe(searchTerm).toLowerCase();

    return list
      .filter((b: any) => getBookCategoryId(b) === cid)
      .filter((b: any) => {
        if (!term) return true;
        const title = safe(b?.title || b?.name).toLowerCase();
        const author = safe(b?.author?.name).toLowerCase();
        const desc = safe(b?.description).toLowerCase();
        const lib = safe(b?.library?.name).toLowerCase();
        return (
          title.includes(term) ||
          author.includes(term) ||
          desc.includes(term) ||
          lib.includes(term)
        );
      });
  }, [books, selectedCategoryId, searchTerm]);

  const isBookSaved = (bookId: number) =>
    (Array.isArray(savedBooks) ? savedBooks : []).some(
      (b: any) => Number(b?.id) === Number(bookId),
    );

  const handleSaveBook = async (book: any, e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!Number.isFinite(userId) || userId <= 0) {
      message.warning("Login qiling (userId topilmadi).");
      return;
    }

    const bid = Number(book?.id);
    if (!Number.isFinite(bid)) return;

    if (savingBookId === bid) return;

    setSavingBookId(bid);
    try {
      if (isBookSaved(bid)) {
        await dispatch(unsaveBookFromBackend({ userId, bookId: bid })).unwrap();
        message.success("Book removed from saved books");
      } else {
        await dispatch(saveBookToBackend({ userId, bookId: bid })).unwrap();
        message.success("Book saved successfully");
      }
    } catch (err: any) {
      message.error(err?.message || "Saved action failed");
    } finally {
      setSavingBookId(null);
    }
  };

  const handleBorrowBook = (_book: any, e: any) => {
    e.preventDefault();
    e.stopPropagation();
    message.info("Borrow functionality will be implemented soon");
  };

  if (catLoading || booksLoading) {
    return (
      <CategoryWrapper>
        <Skeleton active paragraph={{ rows: 1 }} />
        <Row gutter={16} style={{ marginTop: 20 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Skeleton.Image style={{ width: "100%", height: 150 }} />
              <Skeleton active />
            </Col>
          ))}
        </Row>
      </CategoryWrapper>
    );
  }

  return (
    <CategoryWrapper>
      <h1>Explore Categories</h1>

      {/* ✅ Category List */}
      {selectedCategoryId === null && (
        <CategoryGrid>
          {filteredCategories.map((cat: any) => {
            const count = booksCountByCategory.get(Number(cat.id)) ?? 0;
            return (
              <CategoryCard
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryId(Number(cat.id));
                  setSearchTerm("");
                }}
              >
                <CategoryTitle>{cat.categoryName}</CategoryTitle>
                <CategoryDesc>{cat.desc}</CategoryDesc>
                <CountText>{count} books</CountText>
              </CategoryCard>
            );
          })}
        </CategoryGrid>
      )}

      {/* ✅ Selected Category Books */}
      {selectedCategoryId !== null && (
        <BooksSection>
          <TopRow>
            <div>
              <h2 style={{ margin: 0 }}>
                {selectedCategory?.categoryName || "Category"}
              </h2>
              <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
                {displayedBooks.length} books found
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <SearchWrapper>
                <Input
                  placeholder="Search in this category..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 340, height: 40 }}
                />
              </SearchWrapper>

              <Button onClick={() => setSelectedCategoryId(null)}>
                Back to Categories
              </Button>
            </div>
          </TopRow>

          {displayedBooks.length === 0 ? (
            <p style={{ marginTop: 20 }}>No books in this category.</p>
          ) : (
            <BooksGrid>
              {displayedBooks.map((book: any) => {
                const displayName = book?.name || book?.title || "Book";
                const imgSrc = safe(book?.img) ? book.img : PLACEHOLDER;

                const authorName = safe(book?.author?.name) || "—";
                const categoryName =
                  safe(book?.category?.categoryName || book?.category?.name) ||
                  "—";
                const libraryName = safe(book?.library?.name) || "—";

                const saved = isBookSaved(book.id);
                const btnLoading =
                  savedLoading || savingBookId === Number(book?.id);

                return (
                  <BookCard key={book.id}>
                    <BookContent>
                      <Link
                        to={`/books/${book.id}`}
                        style={{
                          textDecoration: "none",
                          display: "flex",
                          flexDirection: "column",
                          color: "inherit",
                          flex: 1,
                          minHeight: 0,
                        }}
                      >
                        <BookImg
                          src={imgSrc}
                          alt={displayName}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              PLACEHOLDER;
                          }}
                        />

                        <BookTitle>{displayName}</BookTitle>

                        <BookMeta>
                          <span>
                            <UserOutlined /> {authorName}
                          </span>
                          <span>
                            <TagOutlined /> {categoryName}
                          </span>
                          <span>
                            <HomeOutlined /> {libraryName}
                          </span>
                        </BookMeta>
                      </Link>
                    </BookContent>

                    <BookActions>
                      <Button
                        type="text"
                        icon={saved ? <HeartFilled /> : <HeartOutlined />}
                        onClick={(e) => handleSaveBook(book, e)}
                        loading={btnLoading}
                        disabled={btnLoading}
                        style={{
                          flex: 1,
                          color: saved ? "#ff4d4f" : "#666",
                          border: "1px solid #d9d9d9",
                          borderRadius: "6px",
                        }}
                      >
                        {saved ? "Saved" : "Save"}
                      </Button>

                      <Button
                        type="primary"
                        icon={<BookOutlined />}
                        onClick={(e) => handleBorrowBook(book, e)}
                        style={{ flex: 1 }}
                      >
                        Borrow
                      </Button>
                    </BookActions>
                  </BookCard>
                );
              })}
            </BooksGrid>
          )}
        </BooksSection>
      )}
    </CategoryWrapper>
  );
}
