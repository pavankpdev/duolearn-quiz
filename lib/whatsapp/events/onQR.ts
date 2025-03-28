import qrcode from "qrcode-terminal";

export const onQR = (qr: string) => {
  qrcode.generate(qr, { small: true });
};
