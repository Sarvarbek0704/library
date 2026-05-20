// src/components/UserMenu/UserProfile/ProfileModal.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchMyUser,
  updateUser,
  type AnyUser,
  getLoginPhone,
  resolveImageUrl,
} from "../../../api/user";
import { logout } from "../../../api/auth";

import {
  Backdrop,
  Card,
  CardHead,
  Close,
  HeadLeft,
  AvatarPickBtn,
  BigAvatarWrap,
  BigAvatarImg,
  BigAvatarFallback,
  HeadTexts,
  BigName,
  BigEmail,
  Line,
  Row,
  Key,
  ValueInput,
  SaveBtn,
  Note,
  LogoutBtn,
} from "./ProfileModal.styled";

const FALLBACK: AnyUser = {
  firstName: "",
  lastName: "",
  phone: "",
  img: "",
};

export default function ProfileModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved?: (u: AnyUser) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [raw, setRaw] = useState<AnyUser | null>(null);
  const [form, setForm] = useState<AnyUser>({ ...FALLBACK });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      try {
        const u = await fetchMyUser();

        if (!u) {
          setRaw(null);
          setForm({ ...FALLBACK, phone: getLoginPhone() });
          setImgPreview("");
          setPickedFile(null);
          return;
        }

        const img = resolveImageUrl(u.img || u.avatar || u.image);

        setRaw(u);
        setForm({
          ...FALLBACK,
          ...u,
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          phone: getLoginPhone() || u.phone || "",
          img,
        });

        setImgPreview(img);
        setPickedFile(null);
      } catch (e) {
        console.error(e);
        setRaw(null);
        setForm({ ...FALLBACK, phone: getLoginPhone() });
        setImgPreview("");
        setPickedFile(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open]);

  // objectURL tozalash
  useEffect(() => {
    return () => {
      if (imgPreview?.startsWith("blob:")) URL.revokeObjectURL(imgPreview);
    };
  }, [imgPreview]);

  const fullName = useMemo(() => {
    const fn = String(form.firstName || "").trim();
    const ln = String(form.lastName || "").trim();
    return `${fn}${ln ? " " + ln : ""}`.trim() || "Your name";
  }, [form.firstName, form.lastName]);

  const letter = useMemo(
    () => fullName.slice(0, 1).toUpperCase() || "A",
    [fullName],
  );

  const set = (k: string, v: any) => setForm((p) => ({ ...(p || {}), [k]: v }));

  const pickImage = (file: File | null) => {
    if (!file) {
      setPickedFile(null);
      setImgPreview(resolveImageUrl(form?.img));
      return;
    }
    setPickedFile(file);
    const url = URL.createObjectURL(file);
    setImgPreview(url);
  };

  const save = async () => {
    const id =
      raw?.id ?? raw?.userId ?? raw?._id ?? localStorage.getItem("userId");
    if (id == null) {
      console.error(
        "User id topilmadi (raw.id ham, localStorage userId ham yo‘q)",
      );
      return;
    }

    setSaving(true);
    try {
      const payload: AnyUser = {
        firstName: String(form.firstName || "").trim(),
        lastName: String(form.lastName || "").trim(),
        // phone PATCHga qo'shmaymiz (siz aytgandek edit emas)
      };

      const updated = await updateUser(id, payload, pickedFile);

      onSaved?.(updated);
      window.dispatchEvent(
        new CustomEvent("user:updated", { detail: updated }),
      );
      onClose();
    } catch (e) {
      console.error("SAVE ERROR:", e);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Backdrop onClick={onClose}>
      <Card
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHead>
          <HeadLeft>
            <AvatarPickBtn
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={loading || saving}
              aria-label="Change avatar"
            >
              <BigAvatarWrap>
                {imgPreview ? (
                  <BigAvatarImg src={imgPreview} alt="avatar" />
                ) : (
                  <BigAvatarFallback>{letter}</BigAvatarFallback>
                )}
              </BigAvatarWrap>
            </AvatarPickBtn>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => pickImage(e.target.files?.[0] || null)}
            />

            <HeadTexts>
              <BigName>{fullName}</BigName>
              <BigEmail>{raw?.email || ""}</BigEmail>
            </HeadTexts>
          </HeadLeft>

          <Close type="button" onClick={onClose} aria-label="Close">
            ×
          </Close>
        </CardHead>

        <Line />

        <div style={{ padding: 16 }}>
          <Row>
            <Key>Phone</Key>
            <ValueInput
              disabled
              readOnly
              value={getLoginPhone() || form.phone || ""}
            />
          </Row>

          <Row>
            <Key>First name</Key>
            <ValueInput
              disabled={loading || saving}
              value={form.firstName ?? ""}
              onChange={(e) => set("firstName", e.target.value)}
              placeholder="Enter first name"
            />
          </Row>

          <Row>
            <Key>Last name</Key>
            <ValueInput
              disabled={loading || saving}
              value={form.lastName ?? ""}
              onChange={(e) => set("lastName", e.target.value)}
              placeholder="Enter last name"
            />
          </Row>

          <div style={{ marginTop: 14 }}>
            <SaveBtn type="button" disabled={saving || loading} onClick={save}>
              {saving ? "Saving..." : "Save Change"}
            </SaveBtn>

            <LogoutBtn
              type="button"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
            >
              Logout
            </LogoutBtn>

            {!loading && !raw && (
              <Note>User topilmadi (fetchMyUser null qaytdi).</Note>
            )}
          </div>
        </div>
      </Card>
    </Backdrop>
  );
}
