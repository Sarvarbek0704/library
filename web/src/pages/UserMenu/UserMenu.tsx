// src/components/UserMenu/UserMenu.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchMyUser, type AnyUser, resolveImageUrl } from "../../api/user";
import ProfileModal from "./UserProfile/ProfileModal";
import {
  MenuWrap,
  Trigger,
  AvatarWrap,
  AvatarImg,
  AvatarFallback,
  NameText,
} from "./UserMenu.styled";

const ME_CACHE_KEY = "me_cache";

export default function UserMenu() {
  const [profileOpen, setProfileOpen] = useState(false);

  const [me, setMe] = useState<AnyUser | null>(() => {
    try {
      const raw = localStorage.getItem(ME_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;

    // ✅ agar cache bo‘lmasa, loading ko‘rsatamiz
    setLoading(!me);

    // ✅ “qotib qolmasin” deb 2.5 sekunddan keyin majburan o‘chiramiz
    const t = window.setTimeout(() => {
      if (alive) setLoading(false);
    }, 2500);

    fetchMyUser()
      .then((u) => {
        if (!alive) return;

        // ✅ agar user topilmasa — cache tozalaymiz va oddiy fallback bo‘ladi
        if (!u) {
          localStorage.removeItem(ME_CACHE_KEY);
          setMe(null);
          return;
        }

        setMe(u);
        localStorage.setItem(ME_CACHE_KEY, JSON.stringify(u));
      })
      .catch(() => {
        if (!alive) return;
        // ✅ error bo‘lsa ham qotib qolmasin
        setLoading(false);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
        window.clearTimeout(t);
      });

    return () => {
      alive = false;
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onUpdated = (e: any) => {
      if (e?.detail) {
        setMe(e.detail);
        localStorage.setItem(ME_CACHE_KEY, JSON.stringify(e.detail));
      }
    };
    window.addEventListener("user:updated", onUpdated as any);
    return () => window.removeEventListener("user:updated", onUpdated as any);
  }, []);

  const img = resolveImageUrl(me?.img || me?.avatar || me?.image);

  // ✅ loading bo‘lsa bo‘sh; me bo‘lmasa ham bo‘sh (Admin/Your name yozmaymiz)
  const name = useMemo(() => {
    if (!me) return "";
    return `${me?.firstName || ""}${me?.lastName ? " " + me.lastName : ""}`.trim();
  }, [me]);

  const letter = useMemo(() => (name ? name[0].toUpperCase() : "A"), [name]);

  return (
    <>
      <MenuWrap ref={rootRef}>
        <Trigger type="button" onClick={() => setProfileOpen(true)}>
          <AvatarWrap>
            {img ? (
              <AvatarImg src={img} alt="avatar" />
            ) : (
              <AvatarFallback>{letter}</AvatarFallback> // ✅ har doim biror narsa chiqadi
            )}
          </AvatarWrap>

          {/* ✅ “…” qotib turmasin: loading bo‘lsa ham name bo‘sh bo‘lsa ham joy saqlab turadi */}
          <NameText style={{ minWidth: 90 }}>{loading ? "" : name}</NameText>
        </Trigger>
      </MenuWrap>

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onSaved={(u) => {
          setMe(u);
          localStorage.setItem(ME_CACHE_KEY, JSON.stringify(u));
        }}
      />
    </>
  );
}
