import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProviderWrapper } from "@/components/auth/auth-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Layout } from "@/components/layout/layout";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import Schedule from "@/pages/schedule";
import Team from "@/pages/team";
import Materials from "@/pages/materials";
import Documents from "@/pages/documents";
import Messages from "@/pages/messages";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/dashboard" component={() => <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/projects" component={() => <ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
      <Route path="/schedule" component={() => <ProtectedRoute><Layout><Schedule /></Layout></ProtectedRoute>} />
      <Route path="/team" component={() => <ProtectedRoute><Layout><Team /></Layout></ProtectedRoute>} />
      <Route path="/materials" component={() => <ProtectedRoute><Layout><Materials /></Layout></ProtectedRoute>} />
      <Route path="/documents" component={() => <ProtectedRoute><Layout><Documents /></Layout></ProtectedRoute>} />
      <Route path="/messages" component={() => <ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderWrapper>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProviderWrapper>
    </QueryClientProvider>
  );
}

export default App;
