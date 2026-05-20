import React, { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Membership } from "../../types/membership";
import {
  BackBtn,
  CardPreview,
  CardPreviewBig,
  CardPreviewRow,
  Container,
  Divider,
  Dot,
  Feature,
  FeatureList,
  Field,
  FieldGrid,
  Input,
  Label,
  Layout,
  Page,
  PageTitle,
  Panel,
  PayBtn,
  PriceRow,
  PriceStrong,
  PriceTable,
  SectionTitle,
  Select,
  SmallLinkBtn,
  SmallNote,
  StatusPill,
  SummaryBottom,
  SummarySub,
  SummaryTitle,
  TopBar,
  TwoCols,
} from "./memberShipPayment.styled";

import { message } from "antd";
import {
  apiCreatePayment,
  type PaymentBody,
  type PaymentStatus,
} from "../../api/payment";

/* ================= HELPERS ================= */

const money = (n: unknown) => {
  const val = Number(n);
  const safe = Number.isFinite(val) ? val : 0;
  return safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so‘m";
};

const onlyDigits = (v: string) => v.replace(/\D/g, "");

const formatCard = (raw: string) => {
  const d = onlyDigits(raw).slice(0, 16);
  return d.replace(/(.{4})/g, "$1 ").trim();
};

const formatExp = (raw: string) => {
  const d = onlyDigits(raw).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}`;
};

const maskCardForPreview = (formatted: string) => {
  const digits = onlyDigits(formatted);
  if (!digits) return "0000 0000 0000 0000";
  const last4 = digits.slice(-4).padStart(4, "0");
  return `•••• •••• •••• ${last4}`;
};

const getUserId = (): number => {
  const a = localStorage.getItem("userId");
  const n = Number(a);
  if (Number.isFinite(n) && n > 0) return n;

  // fallback: localStorage user ichidan
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      const id = Number(u?.id ?? u?._id);
      if (Number.isFinite(id) && id > 0) return id;
    }
  } catch {}

  return 0;
};

/* ================= COMPONENT ================= */

const Payment: React.FC = () => {
  const location = useLocation();
  const statePlan = (location.state as { plan?: Membership } | null)?.plan;

  const lsPlan: Membership | null = useMemo(() => {
    try {
      const raw = localStorage.getItem("selectedPlan");
      return raw ? (JSON.parse(raw) as Membership) : null;
    } catch {
      return null;
    }
  }, []);

  const plan = statePlan ?? lsPlan;

  const membershipId = Number(plan?.id ?? 0);
  const amount = Number(plan?.price ?? 0);
  const total = amount;

  const isPlanMissing = !plan;

  /* ===== refs ===== */
  const expRef = useRef<HTMLInputElement | null>(null);
  const cvcRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  /* ===== form state ===== */
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("Uzbekistan");
  const [address1, setAddress1] = useState("");

  const [descOpen, setDescOpen] = useState(false);

  const [status, setStatus] = useState<PaymentStatus>("PENDING");
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  const canPay =
    !isPlanMissing &&
    amount > 0 &&
    onlyDigits(cardNumber).length === 16 &&
    onlyDigits(exp).length === 4 &&
    cvc.length === 3 &&
    fullName.trim().length >= 3 &&
    address1.trim().length >= 3;

  const onPay = async () => {
    const userId = getUserId();
    if (!userId) {
      message.error("userId topilmadi. Login qilib qaytadan urinib ko‘ring.");
      return;
    }

    if (!membershipId || membershipId <= 0) {
      message.error("membershipId topilmadi. Plan tanlang.");
      return;
    }

    try {
      setLoading(true);
      setStatus("PENDING");

      // ✅ backend talab qilgan body
      const body: PaymentBody = {
        userId,
        membershipId,
        method: "CARD",
        amount,
        status: "SUCCESS", // ✅ subscribe bosilganda SUCCESS qilib yuboramiz
      };

      const created = await apiCreatePayment(body);

      const id = Number((created as any)?.id ?? (created as any)?.data?.id);
      if (Number.isFinite(id) && id > 0) setPaymentId(id);

      setStatus("SUCCESS");
      message.success("Subscription successful!");
    } catch (e: any) {
      setStatus("FAILED");
      const backendMsg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Payment error";
      message.error(
        Array.isArray(backendMsg) ? backendMsg.join(", ") : String(backendMsg),
      );
    } finally {
      setLoading(false);
    }
  };

  const desc = plan?.description || "";
  const isDescLong = desc.length > 110;

  return (
    <Page>
      <Container>
        <TopBar>
          <BackBtn onClick={() => window.history.back()}>←</BackBtn>
          <PageTitle>Set up your plan</PageTitle>
        </TopBar>

        <Layout>
          {/* LEFT */}
          <Panel>
            <SectionTitle>Payment method</SectionTitle>

            <FieldGrid>
              <Field>
                <Label>Card number</Label>
                <Input
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  inputMode="numeric"
                  maxLength={19}
                  onChange={(e) => {
                    const f = formatCard(e.target.value);
                    setCardNumber(f);
                    if (onlyDigits(f).length === 16) expRef.current?.focus();
                  }}
                />
              </Field>

              <TwoCols>
                <Field>
                  <Label>Expiration date</Label>
                  <Input
                    ref={expRef}
                    placeholder="MM/YY"
                    value={exp}
                    inputMode="numeric"
                    maxLength={5}
                    onChange={(e) => {
                      const f = formatExp(e.target.value);
                      setExp(f);
                      if (onlyDigits(f).length === 4) cvcRef.current?.focus();
                    }}
                  />
                </Field>

                <Field>
                  <Label>Security code</Label>
                  <Input
                    ref={cvcRef}
                    placeholder="CVC"
                    value={cvc}
                    inputMode="numeric"
                    maxLength={3}
                    onChange={(e) => {
                      const d = onlyDigits(e.target.value).slice(0, 3);
                      setCvc(d);
                      if (d.length === 3) nameRef.current?.focus();
                    }}
                  />
                </Field>
              </TwoCols>

              <CardPreview>
                <CardPreviewRow>
                  <span>Card holder</span>
                  <span>{fullName.trim() ? fullName : "—"}</span>
                </CardPreviewRow>
                <CardPreviewRow>
                  <span>Expiry</span>
                  <span>{exp || "MM/YY"}</span>
                </CardPreviewRow>
                <CardPreviewBig>
                  {maskCardForPreview(cardNumber)}
                </CardPreviewBig>
              </CardPreview>
            </FieldGrid>

            <Divider />

            <SectionTitle>Billing address</SectionTitle>

            <FieldGrid>
              <Field>
                <Label>Full name</Label>
                <Input
                  ref={nameRef}
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Field>

              <Field>
                <Label>Country or region</Label>
                <Select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Tajikistan">Tajikistan</option>
                </Select>
              </Field>

              <Field>
                <Label>Address line 1</Label>
                <Input
                  placeholder="Address"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </Field>
            </FieldGrid>
          </Panel>

          {/* RIGHT */}
          <Panel>
            <SummaryTitle>{plan?.name ?? "No plan selected"}</SummaryTitle>

            <SummarySub $expanded={descOpen}>{desc || "—"}</SummarySub>

            {isDescLong && (
              <SmallLinkBtn onClick={() => setDescOpen((p) => !p)}>
                {descOpen ? "Show less" : "Show more"}
              </SmallLinkBtn>
            )}

            {!isPlanMissing && (
              <FeatureList style={{ marginTop: 12 }}>
                <Feature>
                  <Dot>📅</Dot> Duration: {plan.durationDays} days
                </Feature>
                <Feature>
                  <Dot>📚</Dot> Borrow Limit: {plan.limitBorrow}
                </Feature>
                <Feature>
                  <Dot>📖</Dot> Book Limit: {plan.limitBook}
                </Feature>
                <Feature>
                  <Dot>⚡</Dot> Premium features
                </Feature>
              </FeatureList>
            )}

            <Divider />

            <PriceTable>
              <PriceRow>
                <div>Subscription</div>
                <div>{money(amount)}</div>
              </PriceRow>

              <Divider />

              <PriceStrong>
                <div>Total due today</div>
                <div>{money(total)}</div>
              </PriceStrong>
            </PriceTable>

            <SummaryBottom>
              <PayBtn disabled={!canPay || loading} onClick={onPay}>
                {loading ? "Processing..." : "Subscribe"}
              </PayBtn>

              <StatusPill status={status}>
                Payment status: {status} {paymentId ? `(#${paymentId})` : ""}
              </StatusPill>

              <SmallNote>
                Your subscription renews automatically. You can cancel at any
                time in settings.
              </SmallNote>

              {isPlanMissing && (
                <SmallNote style={{ marginTop: 8 }}>
                  ⚠️ Plan not found. Please select a plan from the membership
                  page.
                </SmallNote>
              )}
            </SummaryBottom>
          </Panel>
        </Layout>
      </Container>
    </Page>
  );
};

export default Payment;
