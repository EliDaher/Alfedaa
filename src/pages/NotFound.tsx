import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo } from "react";

const NotFound = () => {
  const storedUser = localStorage.getItem("DaherUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isDashboardAccess = useMemo(
    () => ["admin", "dealer"].includes(user?.role),
    [user?.role],
  );

  const primaryRoute = isDashboardAccess
    ? "/dashboard"
    : "/PendingTransactions";
  const primaryLabel = isDashboardAccess ? "Go to Dashboard" : "Go to Pending Transaction";

  useEffect(()=>{
    console.log(user);
  }, [user])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="mb-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">404</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to={primaryRoute}>
                <Home className="mr-2 h-4 w-4" />
                {primaryLabel}
              </Link>
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
