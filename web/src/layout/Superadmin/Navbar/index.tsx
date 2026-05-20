import { useEffect, useMemo, useState } from "react";
import {
  Header,
  Left,
  Center,
  Right,
  AdminImage,
  AvatarWrap,
  AvatarFallback,
} from "../../AdminHeader.styled";

import ProfileModal from "../../../pages/UserMenu/UserProfile/ProfileModal";
import { fetchMyUser, type AnyUser, resolveImageUrl } from "../../../api/user";

const ME_CACHE_KEY = "me_cache";

const SuperadminNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  const [me, setMe] = useState<AnyUser | null>(() => {
    try {
      const raw = localStorage.getItem(ME_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let alive = true;

    setLoading(!me);

    const t = window.setTimeout(() => {
      if (alive) setLoading(false);
    }, 2500);

    fetchMyUser()
      .then((u) => {
        if (!alive) return;

        if (!u) {
          localStorage.removeItem(ME_CACHE_KEY);
          setMe(null);
          return;
        }

        setMe(u);
        localStorage.setItem(ME_CACHE_KEY, JSON.stringify(u));
      })
      .catch(console.error)
      .finally(() => {
        if (!alive) return;
        setLoading(false);
        window.clearTimeout(t);
      });

    return () => {
      alive = false;
      window.clearTimeout(t);
    };
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

  const name = useMemo(() => {
    if (!me) return "";
    return `${me?.firstName || ""} ${me?.lastName || ""}`.trim();
  }, [me]);

  const letter = name?.[0]?.toUpperCase() || "A";

  return (
    <>
      <Header>
        <Left />
        <Center />
        <Right>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              minWidth: 120,
            }}
            onClick={() => setProfileOpen(true)}
          >
            {img ? (
              <AdminImage src={img} alt="avatar" />
            ) : (
              <AvatarWrap>
                <AvatarFallback>{letter}</AvatarFallback>
              </AvatarWrap>
            )}

            <span style={{ fontWeight: "bold", color: "#333" }}>
              {loading ? "" : name}
            </span>
          </div>
        </Right>
      </Header>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default SuperadminNavbar;
