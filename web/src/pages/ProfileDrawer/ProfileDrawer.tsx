import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/user/user.slice";
import { message } from "antd";

import {
  Backdrop,
  Drawer,
  DrawerHeader,
  Title,
  CloseBtn,
  DrawerBody,
  DrawerFooter,
  Row,
  AvatarWrap,
  Avatar,
  AvatarFallback,
  UploadBtn,
  Divider,
  Grid,
  Field,
  Label,
  Input,
  Hint,
  Actions,
  Btn,
  Small,
} from "./ProfileDrawer.styled";

type AnyUser = Record<string, any>;

type Props = {
  open: boolean;
  onClose: () => void;
  onUserUpdated?: (user: AnyUser) => void;
};

const API_BASE = "http://localhost:3000";

function getLoginPhone(): string {
  return (
    localStorage.getItem("phone") ||
    localStorage.getItem("userPhone") ||
    localStorage.getItem("loginPhone") ||
    ""
  );
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function pickUsers(payload: any): AnyUser[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
}

function getPhone(u: AnyUser) {
  return String(u?.phone || u?.phoneNumber || u?.tel || u?.mobile || "").trim();
}

export default function ProfileDrawer({ open, onClose, onUserUpdated }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [rawUser, setRawUser] = useState<AnyUser | null>(null);
  const [form, setForm] = useState<AnyUser>({});

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>("");

  const loginPhone = useMemo(() => getLoginPhone(), []);

  // ESC yopish
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // User load
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/user`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        });
        if (!res.ok) throw new Error(`GET /api/user failed: ${res.status}`);

        const data = await res.json();
        const list = pickUsers(data);

        const found =
          list.find((u) => getPhone(u) === String(loginPhone).trim()) || null;

        setRawUser(found);
        setForm(found || {});
        setImgPreview(found?.img || found?.avatar || found?.image || "");
        setImgFile(null);
      } catch (e) {
        console.error(e);
        setRawUser(null);
        setForm({});
        setImgPreview("");
        setImgFile(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, loginPhone]);

  // createObjectURL leakni yopish (preview)
  useEffect(() => {
    // agar preview blob: bo‘lsa yopamiz
    return () => {
      if (imgPreview?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(imgPreview);
        } catch {}
      }
    };
  }, [imgPreview]);

  const firstLetter = useMemo(() => {
    const name =
      form?.firstName ||
      form?.name ||
      rawUser?.firstName ||
      rawUser?.name ||
      "";
    return String(name).trim().slice(0, 1).toUpperCase() || "A";
  }, [form, rawUser]);

  const img = imgPreview || form?.img || form?.avatar || form?.image || "";

  const handleChange = (key: string, value: any) => {
    setForm((p) => ({ ...(p || {}), [key]: value }));
  };

  const onPickImage = (file: File | null) => {
    setImgFile(file);

    // old blob url ni tozalaymiz
    if (imgPreview?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imgPreview);
      } catch {}
    }

    if (!file) {
      setImgPreview(rawUser?.img || rawUser?.avatar || rawUser?.image || "");
      return;
    }

    const url = URL.createObjectURL(file);
    setImgPreview(url);
  };

  const handleSave = async () => {
    if (!rawUser) return;

    const userId = rawUser?.id ?? rawUser?.userId ?? rawUser?._id;
    if (userId == null) {
      message.error("User id topilmadi");
      return;
    }

    setSaving(true);
    try {
      let res: Response;

      // password bo‘sh bo‘lsa yubormaymiz (backend validatsiya ko‘p joyda shunga yiqiladi)
      const safeForm = { ...(form || {}) };
      if (!safeForm.password) delete safeForm.password;

      if (imgFile) {
        const fd = new FormData();

        Object.keys(safeForm).forEach((k) => {
          const v = safeForm[k];
          if (v === undefined || v === null) return;
          fd.append(k, String(v));
        });

        fd.append("img", imgFile);

        res = await fetch(`${API_BASE}/api/user/${userId}`, {
          method: "PATCH",
          headers: { ...getAuthHeaders() },
          body: fd,
        });
      } else {
        const payload = {
          ...safeForm,
          img:
            imgPreview ||
            safeForm?.img ||
            safeForm?.avatar ||
            safeForm?.image ||
            "",
        };

        res = await fetch(`${API_BASE}/api/user/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Update failed: ${res.status} ${text}`);
      }

      const updated = await res.json();
      const nextUser = updated?.data || updated?.user || updated;

      setRawUser(nextUser);
      setForm(nextUser || {});
      setImgFile(null);
      setImgPreview(
        nextUser?.img || nextUser?.avatar || nextUser?.image || imgPreview,
      );

      onUserUpdated?.(nextUser);
      message.success("Profile updated");
      onClose();
    } catch (e) {
      console.error(e);
      message.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const phoneValue =
    form?.phone ??
    form?.phoneNumber ??
    rawUser?.phone ??
    rawUser?.phoneNumber ??
    loginPhone ??
    "";

  return (
    <>
      <Backdrop onClick={onClose} />

      <Drawer role="dialog" aria-modal="true">
        <DrawerHeader>
          <Title>My Profile</Title>
          <CloseBtn type="button" onClick={onClose} aria-label="Close">
            ✕
          </CloseBtn>
        </DrawerHeader>

        <DrawerBody>
          {loading ? (
            <Hint>Loading...</Hint>
          ) : !rawUser ? (
            <Hint>
              User topilmadi. <br />
              <Small>Login phone: {loginPhone || "—"}</Small>
            </Hint>
          ) : (
            <>
              <Row>
                <AvatarWrap>
                  {img ? (
                    <Avatar src={img} alt="avatar" />
                  ) : (
                    <AvatarFallback>{firstLetter}</AvatarFallback>
                  )}
                </AvatarWrap>

                <div>
                  <UploadBtn as="label" disabled={saving}>
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => onPickImage(e.target.files?.[0] || null)}
                    />
                  </UploadBtn>
                  <Small>Rasm tanlasang preview chiqadi</Small>
                </div>
              </Row>

              <Divider />

              <Grid>
                <Field>
                  <Label>First name</Label>
                  <Input
                    value={form?.firstName ?? ""}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="First name"
                  />
                </Field>

                <Field>
                  <Label>Last name</Label>
                  <Input
                    value={form?.lastName ?? ""}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Last name"
                  />
                </Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                  <Label>Phone</Label>
                  <Input value={phoneValue} readOnly placeholder="+998..." />
                </Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                  <Label>Email</Label>
                  <Input
                    value={form?.email ?? ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@email.com"
                  />
                </Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                  <Label>Location</Label>
                  <Input
                    value={form?.location ?? ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="Tashkent / USA ..."
                  />
                </Field>

                <Field style={{ gridColumn: "1 / -1" }}>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form?.password ?? ""}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="New password (optional)"
                  />
                  <Small>Bo‘sh qoldirsang password o‘zgarmaydi</Small>
                </Field>
              </Grid>
            </>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Actions>
            <Btn
              type="button"
              $variant="ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Btn>

            <Btn
              type="button"
              $variant="primary"
              onClick={handleSave}
              disabled={saving || !rawUser}
            >
              {saving ? "Saving..." : "Save changes"}
            </Btn>

            <Btn
              type="button"
              $variant="danger"
              onClick={() => {
                dispatch(logout());
                onClose();
              }}
              disabled={saving}
            >
              Logout
            </Btn>
          </Actions>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
