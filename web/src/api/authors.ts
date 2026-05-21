import { api } from "./api";

const API_BASE = "https://library-api-3cn1.onrender.com";

export async function apiFetchAuthors() {
  const res = await api.get("/author?page=1&limit=100");
  const raw = res.data;

  const list = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
      ? raw
      : [];

  return list.map((a: any) => {
    let imageUrl = "";

    if (a.images && Array.isArray(a.images) && a.images.length > 0) {
      const firstImage = a.images[0];
      imageUrl = firstImage.url?.startsWith("http")
        ? firstImage.url
        : `${API_BASE}${firstImage.url}`;
    } else if (a.img) {
      imageUrl = a.img.startsWith("http") ? a.img : `${API_BASE}${a.img}`;
    }

    return {
      ...a,
      id: String(a.id ?? a._id),
      img: imageUrl,
    };
  });
}

export async function apiCreateAuthor(payload: {
  name: string;
  desc?: string;
  img?: File;
}) {
  const fd = new FormData();
  fd.append("name", payload.name);
  if (payload.desc) fd.append("desc", payload.desc);
  if (payload.img) fd.append("avatar", payload.img);

  const res = await api.post("/author", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data?.data ?? res.data;
}

export async function apiUpdateAuthor(
  id: string | number,
  payload: { name: string; desc?: string; img?: File },
) {
  const fd = new FormData();
  fd.append("name", payload.name);

  if (payload.desc !== undefined) fd.append("desc", payload.desc);
  if (payload.img instanceof File) fd.append("avatar", payload.img);

  const res = await api.patch(`/author/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const updated = res.data?.data ?? res.data;

  return {
    ...updated,
    id: String(updated?.id ?? updated?._id ?? id),
  };
}

export async function apiDeleteAuthor(id: string | number) {
  const res = await api.delete(`/author/${id}`);
  return res.data;
}
