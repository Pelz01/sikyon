import { redirect } from "next/navigation";

export default function BoardPage() {
  redirect("/app?tab=registry");
}
