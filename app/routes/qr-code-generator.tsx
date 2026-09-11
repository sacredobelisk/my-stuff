import { QrCodeGeneratorPage } from "~/components/qr-code-generator/qr-code-generator";
import { buildPageMeta } from "~/utils/meta";

export const meta = () =>
  buildPageMeta({
    description: "Generate a downloadable QR code from any text or URL.",
    path: "/qr-code-generator",
    title: "QR Code Generator",
  });

export default function QrCodeGenerator() {
  return <QrCodeGeneratorPage />;
}
