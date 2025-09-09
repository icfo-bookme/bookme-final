// checked
import Footer from "./components/shared/Footer/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import { SearchProvider } from "@/SearchContext";
import { PaginationProvider } from "@/services/tour/usePagination";
import HeaderWrapper from "./components/HeadWrapper/HeaderWrapper";

// Font setup at module scope
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function DashboardLayout({ children }) {
  return (
    <html lang="en" data-theme="white">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bookme</title>
      </head>
      <body className={inter.className}>
        {/*global search provider*/}
        <PaginationProvider>
          <SearchProvider>
            {" "}
            <div>
              <div className="bg-white">
                <main>
                  <div className="">
                    <HeaderWrapper />
                  </div>
                  <div className="min-h-[100vh] py-[12px]">{children}</div>
                  <Footer />
                </main>
              </div>
            </div>
          </SearchProvider>
        </PaginationProvider>

      </body>
    </html>
  );
}
