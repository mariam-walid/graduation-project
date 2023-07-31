import NavBar from "@/components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react"
import { useRouter } from "next/router";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const showHeader = router.pathname === "/login" || router.pathname === "/register" ;
  return (
    <SessionProvider session={session}>
      {!showHeader ? <NavBar/> : null}
      <Component {...pageProps} />
    </SessionProvider>
  );
}
