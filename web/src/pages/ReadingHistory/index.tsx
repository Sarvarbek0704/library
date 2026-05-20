import { useEffect, useMemo } from "react";
import { Skeleton, Row, Col, Tag } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyArchiveBooks } from "../../store/archiveBook/archiveBook.slice";
import { fetchBooks } from "../../store/books/books.slice";

import {
  Wrap,
  Grid,
  Card,
  Img,
  Title,
  Meta,
  Small,
  Empty,
} from "./ReadingHistory.styled";

const PLACEHOLDER = "https://via.placeholder.com/300x400?text=No+Image";
const safe = (v: any) => String(v ?? "");

export default function ReadingHistory() {
  const dispatch = useAppDispatch();
  const userId = Number(localStorage.getItem("userId") || 0);

  const { my, myLoading } = useAppSelector((s) => s.archive);
  const { data: books, loading: booksLoading } = useAppSelector((s) => s.books);

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchMyArchiveBooks(userId));
    // agar archive record ichida book join bo‘lmasa, books listdan topamiz
    dispatch(fetchBooks({ page: 1, limit: 1000 }));
  }, [dispatch, userId]);

  const bookById = useMemo(() => {
    const map = new Map<number, any>();
    (Array.isArray(books) ? books : []).forEach((b: any) =>
      map.set(Number(b.id), b),
    );
    return map;
  }, [books]);

  const items = useMemo(() => {
    return (Array.isArray(my) ? my : []).map((x: any) => {
      const b = x.book || bookById.get(Number(x.bookId));
      return { ...x, book: b };
    });
  }, [my, bookById]);

  if (myLoading || booksLoading) {
    return (
      <Wrap>
        <h1>Reading History</h1>
        <Row gutter={16} style={{ marginTop: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6}>
              <Skeleton.Image style={{ width: "100%", height: 260 }} />
              <Skeleton active />
            </Col>
          ))}
        </Row>
      </Wrap>
    );
  }

  if (!items.length) {
    return (
      <Wrap>
        <h1>Reading History</h1>
        <Empty>Hali tarix yo‘q. Biror kitobni Borrow qiling 🙂</Empty>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <h1>Reading History</h1>

      <Grid>
        {items.map((x: any) => {
          const b = x.book || {};
          const name = safe(b?.name || b?.title || `Book #${x.bookId}`);
          const img = safe(b?.img) || PLACEHOLDER;

          return (
            <Card key={x.id}>
              <Link
                to={`/books/${Number(x.bookId)}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Img
                  src={img}
                  alt={name}
                  onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).src = PLACEHOLDER)
                  }
                />

                <Title title={name}>{name}</Title>

                <Meta>
                  <Small>
                    Borrowed:{" "}
                    {x.borrowedAt
                      ? dayjs(x.borrowedAt).format("MMM D, YYYY")
                      : "—"}
                  </Small>
                  <Small>
                    Returned:{" "}
                    {x.returnedAt
                      ? dayjs(x.returnedAt).format("MMM D, YYYY")
                      : "—"}
                  </Small>
                  <Tag>{safe(x.status || "—")}</Tag>
                </Meta>
              </Link>
            </Card>
          );
        })}
      </Grid>
    </Wrap>
  );
}
