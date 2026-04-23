import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Go-shop - Administration",
    description: "Go-shop - Espace administration",
};

export default function RootAdminLayout({ children }) {
    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
