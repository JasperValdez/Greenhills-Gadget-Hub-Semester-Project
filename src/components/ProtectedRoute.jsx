import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase-client";

const ProtectedRoute = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      if (!role) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setAuthorized(profile?.role === role);
      setLoading(false);
    };

    checkUser();
  }, [role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return authorized ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;