import { useAuth } from "../hooks/useAuth";

export default function AuthTest() {
  const { data, isLoading, error } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error</p>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.email}</p>
    </div>
  );
}
