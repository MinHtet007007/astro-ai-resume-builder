import { signIn } from "@/auth";

export default async function SignInGoogleForm() {
  return (
    <form
      action={async () => {
        await signIn("google");
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
