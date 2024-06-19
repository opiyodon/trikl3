'use client'

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import AdminFooter from "@/components/admin/AdminFooter";
import AdminNav from "@/components/admin/AdminNav";
import { usePathname } from "next/navigation";

const CommonLayout = ({ children }) => {

    const pathName = usePathname();
    const adminRoutePattern = /^\/admin(\/.*)?/;
    const authRoutes = ["/login", "/register"];

    const isAdminRoute = adminRoutePattern.test(pathName);
    const isAuthRoute = authRoutes.includes(pathName);

    return (
        <>
            {isAdminRoute ? <AdminNav /> : isAuthRoute ? null : <Nav />}
            {children}
            {/* {isAdminRoute ? <AdminFooter /> : isAuthRoute ? null : <Footer />} */}
        </>
    )
}

export default CommonLayout
