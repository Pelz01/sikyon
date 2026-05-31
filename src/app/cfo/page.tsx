import { redirect } from "next/navigation";

export default function CFOPage() {
  redirect("/app?tab=cfo");
}
