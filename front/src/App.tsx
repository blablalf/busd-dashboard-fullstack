import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "./components/Header/Header.tsx";
import Home from "./components/Home/Home.tsx";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Modals from "./components/Modals.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Header />
        <Home />
        <Modals />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
