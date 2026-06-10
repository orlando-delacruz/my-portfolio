import AuthProvider from "./providers/AuthProvider";
import PublicRoutes from "./routes/PublicRoutes";

export default function App() {
  return (
    <AuthProvider>
      <PublicRoutes />
    </AuthProvider>
  );
}