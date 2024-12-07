import { Suspense } from "react";
import Loading from "@/components/Loading";
import UserProfile from "@/components/user/UserProfile";

export default function UserPage() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile />
    </Suspense>
  );
}
