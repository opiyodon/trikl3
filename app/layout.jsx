import CommonLayout from "./CommonLayout";
import Providers from "./Providers";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Trikl3</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <Providers>
            <CommonLayout>
              {children}
            </CommonLayout>
        </Providers>
      </body>
    </html>
  );
}
