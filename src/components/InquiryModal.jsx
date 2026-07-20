import { useEffect, useState } from "react";
import { X } from "lucide-react";

const FIELD_STYLE = {
  width: "100%",
  padding: "11px 14px",
  fontSize: 14,
  color: "var(--text-strong)",
  background: "#fff",
  border: "1px solid var(--border)",
  outline: "none",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InquiryModal({ open, company, email, onClose }) {
  const [contact, setContact] = useState("");
  const [contactTouched, setContactTouched] = useState(false);
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const contactValid = EMAIL_PATTERN.test(contact);
  const contactError = contactTouched && contact.length > 0 && !contactValid;
  const formValid = contactValid && org.trim() !== "" && name.trim() !== "" && message.trim() !== "" && consent;

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setContact("");
      setContactTouched(false);
      setOrg("");
      setName("");
      setMessage("");
      setConsent(false);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setContactTouched(true);
    if (!formValid) return;
    const subject = encodeURIComponent(`[${company}] 사업 문의`);
    const body = encodeURIComponent(
      `이메일: ${contact}\n소속기관: ${org}\n성명: ${name}\n\n${message}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10,10,10,.55)",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 640,
          padding: 40,
          background: "#fff",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            border: "none",
            background: "transparent",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <X width={20} height={20} />
        </button>

        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "var(--primary)", marginBottom: 10 }}>
          {company}
        </div>
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>
          사업 문의하기
        </h3>
        <p style={{ margin: "12px 0 28px", fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)" }}>
          남겨주신 내용은 메일 작성 화면을 통해 {company} 담당자에게 전달됩니다.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <input
              required
              type="email"
              placeholder="회신받을 이메일"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onBlur={() => setContactTouched(true)}
              style={{
                ...FIELD_STYLE,
                borderColor: contactError ? "var(--danger)" : "var(--border)",
              }}
            />
            {contactError && (
              <div style={{ marginTop: 6, fontSize: 12, color: "var(--danger)" }}>
                올바른 이메일 주소를 입력해 주세요.
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <input
              required
              type="text"
              placeholder="소속기관"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              style={FIELD_STYLE}
            />
            <input
              required
              type="text"
              placeholder="성명"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={FIELD_STYLE}
            />
          </div>
          <textarea
            required
            placeholder="문의 내용"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            style={{ ...FIELD_STYLE, resize: "vertical", fontFamily: "inherit" }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
            <input
              required
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            개인정보 수집 및 이용에 동의합니다
          </label>
          <button
            type="submit"
            disabled={!formValid}
            style={{
              marginTop: 6,
              padding: "13px 0",
              fontWeight: 600,
              fontSize: 14,
              color: "#fff",
              background: formValid ? "var(--primary)" : "var(--grey-300)",
              border: "none",
              cursor: formValid ? "pointer" : "not-allowed",
            }}
          >
            메일 보내기
          </button>
        </form>
      </div>
    </div>
  );
}
