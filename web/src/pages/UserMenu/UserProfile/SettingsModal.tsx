import  { useState } from "react";
import {
  Backdrop,
  Card,
  Head,
  Close,
  Row,
  Key,
  Select,
} from "./SettingsModal.styled";

export default function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [theme, setTheme] = useState<"Light" | "Dark">("Light");
  const [lang, setLang] = useState<"Eng" | "Uz">("Eng");

  if (!open) return null;

  return (
    <>
      <Backdrop onClick={onClose} />
      <Card role="dialog" aria-modal="true">
        <Head>
          <div style={{ fontWeight: 900, color: "#0f172a" }}>Settings</div>
          <Close type="button" onClick={onClose}>
            ×
          </Close>
        </Head>

        <Row>
          <Key>Theme</Key>
          <Select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
          >
            <option>Light</option>
            <option>Dark</option>
          </Select>
        </Row>

        <Row>
          <Key>Language</Key>
          <Select value={lang} onChange={(e) => setLang(e.target.value as any)}>
            <option>Eng</option>
            <option>Uz</option>
          </Select>
        </Row>
      </Card>
    </>
  );
}
