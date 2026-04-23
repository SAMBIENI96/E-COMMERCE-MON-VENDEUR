import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Go-shop - Espace vendeur",
    description: "Go-shop - Tableau de bord vendeur",
};

export default function RootAdminLayout({ children }) {
    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
