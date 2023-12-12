import * as React from "react";

/**
 * Developer Notes
 *
 * In all homesty this can be redone using react-helmet.
 **/

// Define types
type MetaTags = {
  description?: string;
  keywords?: string;
};

type HeadState = {
  title: string;
  metaTags: MetaTags;
};

type HeadContextType = {
  state: HeadState;
  setHead: (title: string, metaTags: MetaTags) => void;
};

// Contexts
const HeadContext = React.createContext<HeadContextType | undefined>(undefined);

// Provider Component
const HeadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = React.useState<HeadState>({
    title: "",
    metaTags: {},
  });

  const setHead = (title: string, metaTags: MetaTags) => {
    setState({ title, metaTags });
  };

  return (
    <HeadContext.Provider value={{ state, setHead }}>
      {children}
    </HeadContext.Provider>
  );
};

// Custom Hook for Updating Head
function useHead(title: string, metaTags: MetaTags) {
  const context = React.useContext(HeadContext);
  if (!context) {
    throw new Error("useHead must be used within a HeadProvider");
  }

  React.useEffect(() => {
    context.setHead(title, metaTags);
    document.title = title;
    // Update meta tags logic here
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", metaTags.description || "");
  }, [title, metaTags, context]);
}

export { HeadProvider, useHead };

// USAGE;

// useHead("My Page Title", {
//   description: "Page description",
//   keywords: "keyword1, keyword2",
// });
