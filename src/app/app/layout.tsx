import SuiProviders from "@/components/SuiProviders";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuiProviders>{children}</SuiProviders>;
}
