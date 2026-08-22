/**
 * COUNTER JOURNAL DESIGN NOTE: App composition keeps every route inside the
 * same service-counter shell so wayfinding and support remain continuous.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { SiteShell } from "./components/SiteShell";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import TestConsole from "./pages/TestConsole";
import NotFound from "./pages/NotFound";

function Router() { return <SiteShell><Switch><Route path="/" component={Home} /><Route path="/menu" component={Menu} /><Route path="/about" component={About} /><Route path="/contact" component={Contact} /><Route path="/checkout" component={Checkout} /><Route path="/dashboard" component={Dashboard} /><Route path="/test-console" component={TestConsole} /><Route component={NotFound} /></Switch></SiteShell>; }
function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><CartProvider><Toaster /><Router /></CartProvider></TooltipProvider></ThemeProvider></ErrorBoundary>; }
export default App;
