import { QrCodeGeneratorPage } from "../components/qr-code-generator/qr-code-generator";
import type { Route } from "./+types/qr-code-generator";

export function meta({}: Route.MetaArgs) {
  const title = "QR Code Generator - Sean OBrien";
  const description = "Generate a downloadable QR code from any text or URL.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.sean-obrien.net/qr-code-generator" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function QrCodeGenerator() {
  return <QrCodeGeneratorPage />;
}
