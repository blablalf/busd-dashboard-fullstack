import useLogin from "../hooks/useLogin.ts";

export default function LoginButton() {
  const { mutate: login }: { mutate: () => void } = useLogin(); // Add typing for mutate function

  return <button onClick={login}>Connect</button>;
}
