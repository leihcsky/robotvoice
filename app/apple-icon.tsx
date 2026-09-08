import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0d8f7e",
          borderRadius: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 32 32">
          <circle cx="9" cy="16" r="3.15" fill="#f3f7fb" />
          <path
            d="M15 10.55a7.5 7.5 0 0 1 0 10.9"
            fill="none"
            stroke="#f3f7fb"
            strokeWidth="2.35"
            strokeLinecap="round"
          />
          <path
            d="M19.35 7.15a11.9 11.9 0 0 1 0 17.7"
            fill="none"
            stroke="#f3f7fb"
            strokeWidth="2.35"
            strokeLinecap="round"
          />
          <path
            d="M23.55 4.15a15.9 15.9 0 0 1 0 23.7"
            fill="none"
            stroke="#f3f7fb"
            strokeWidth="2.35"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
