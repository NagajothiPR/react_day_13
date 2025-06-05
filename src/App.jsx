import { useState, useEffect, useRef } from "react";
import "./App.css";

// 1) useCounter Hook
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset };
};

// 2) useToggle Hook
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
};

// 3) useLocalStorage Hook
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

// 4) useFetch Hook
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then(json => {
        setData(json);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);
  return { data, loading, error };
};

// 5) useInput Hook
const useInput = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const onChange = e => setValue(e.target.value);
  return { value, onChange };
};

// 6) useDebounce Hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// 7) usePrevious Hook
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

// 8) useHover Hook
const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);
    node.addEventListener("mouseenter", onMouseEnter);
    node.addEventListener("mouseleave", onMouseLeave);
    return () => {
      node.removeEventListener("mouseenter", onMouseEnter);
      node.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);
  return [isHovered, ref];
};

// 9) useTitle Hook
const useTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

// 10) useTimeout Hook
const useTimeout = (callback, delay) => {
  useEffect(() => {
    if (delay === null) return;
    const id = setTimeout(callback, delay);
    return () => clearTimeout(id);
  }, [callback, delay]);
};

// 11) useClipboard Hook
const useClipboard = () => {
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };
  return { copy };
};

// 12) useMediaQuery Hook
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
};

// 13) useOnlineStatus Hook
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  return isOnline;
};

// 14) useGeolocation Hook
const useGeolocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(loc => ({ ...loc, error: "Geolocation not supported" }));
      return;
    }
    const watcher = navigator.geolocation.watchPosition(
      pos => setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        error: null,
      }),
      err => setLocation(loc => ({ ...loc, error: err.message })),
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);
  return location;
};

// 15) useTheme Hook
const useTheme = () => {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  return { theme, toggleTheme };
};


// -------------------------- Demo Components -----------------------------

const CounterDemo = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+ Increment</button>
      <button onClick={decrement}>- Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

const ToggleDemo = () => {
  const [isOpen, toggle] = useToggle(false);
  return (
    <div>
      <p>Status: {isOpen ? "Open ✅" : "Closed ❌"}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
};

const LocalStorageDemo = () => {
  const [value, setValue] = useLocalStorage("username", "");
  return (
    <div>
      <input
        type="text"
        value={value}
        placeholder="Enter your name"
        onChange={e => setValue(e.target.value)}
      />
      <p>Stored in localStorage: {value}</p>
    </div>
  );
};

const FetchDemo = () => {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const { data, loading, error } = useFetch(url);

  return (
    <div>
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "100%" }}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <pre style={{ textAlign: "left", maxHeight: 200, overflow: "auto" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

const InputDemo = () => {
  const { value, onChange } = useInput("");
  return (
    <div>
      <input value={value} onChange={onChange} placeholder="Type something..." />
      <p>You typed: {value}</p>
    </div>
  );
};

const DebounceDemo = () => {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 500);
  return (
    <div>
      <input
        placeholder="Type to debounce..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <p>Debounced value: {debouncedText}</p>
    </div>
  );
};

const PreviousDemo = () => {
   const input = useInput("");
        const prev = usePrevious(input.value);
        return (
          <>
            <h2>usePrevious</h2>
            <input {...input} />
            <p>Previous: {prev}</p>
          </>
        );
      }

const HoverDemo = () => {
  const [isHovered, ref] = useHover();
  return (
    <div
      ref={ref}
      style={{
        width: 150,
        height: 100,
        backgroundColor: isHovered ? "#007bff" : "#ccc",
        color: isHovered ? "white" : "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {isHovered ? "Hovered!" : "Hover me"}
    </div>
  );
};

const TitleDemo = () => {
  const [title, setTitle] = useState("Hello");
  useTitle(title);
  return (
    <div>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Set document title"
      />
      <p>Current title: {title}</p>
    </div>
  );
};

const TimeoutDemo = () => {
  const [message, setMessage] = useState("Waiting...");
  useTimeout(() => setMessage("Timeout triggered!"), 3000);
  return (
    <div>
      <p>{message}</p>
      <small>(Message changes after 3 seconds)</small>
    </div>
  );
};

const ClipboardDemo = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const { copy } = useClipboard();

  const handleCopy = async () => {
    if (await copy(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Text to copy"
      />
      <button onClick={handleCopy}>Copy</button>
      {copied && <span style={{ marginLeft: 10, color: "green" }}>Copied!</span>}
    </div>
  );
};

const MediaQueryDemo = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div>
      <p>Screen is {isMobile ? "Mobile" : "Desktop"}</p>
    </div>
  );
};

const OnlineStatusDemo = () => {
  const isOnline = useOnlineStatus();
  return (
    <div>
      <p>You are currently: {isOnline ? "Online ✅" : "Offline ❌"}</p>
    </div>
  );
};

const GeolocationDemo = () => {
  const { latitude, longitude, error } = useGeolocation();
  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <>
          <p>Latitude: {latitude ?? "Loading..."}</p>
          <p>Longitude: {longitude ?? "Loading..."}</p>
        </>
      )}
    </div>
  );
};

const ThemeDemo = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};


// -------------------------- Main App ----------------------

export default function App() {
  const [selected, setSelected] = useState("useCounter");

  const renderComponent = () => {
    switch (selected) {
      case "useCounter": return <CounterDemo />;
      case "useToggle": return <ToggleDemo />;
      case "useLocalStorage": return <LocalStorageDemo />;
      case "useFetch": return <FetchDemo />;
      case "useInput": return <InputDemo />;
      case "useDebounce": return <DebounceDemo />;
      case "usePrevious": return <PreviousDemo />;
      case "useHover": return <HoverDemo />;
      case "useTitle": return <TitleDemo />;
      case "useTimeout": return <TimeoutDemo />;
      case "useClipboard": return <ClipboardDemo />;
      case "useMediaQuery": return <MediaQueryDemo />;
      case "useOnlineStatus": return <OnlineStatusDemo />;
      case "useGeolocation": return <GeolocationDemo />;
      case "useTheme": return <ThemeDemo />;   
      default: return <p>Select a task.</p>;
    }
  };

  return (
    <div className="app-container">
      <h1>Custom Hooks</h1>
      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
      >
        <option value="useCounter">useCounter</option>
        <option value="useToggle">useToggle</option>
        <option value="useLocalStorage">useLocalStorage</option>
        <option value="useFetch">useFetch</option>
        <option value="useInput">useInput</option>
        <option value="useDebounce">useDebounce</option>
        <option value="usePrevious">usePrevious</option>
        <option value="useHover">useHover</option>
        <option value="useTitle">useTitle</option>
        <option value="useTimeout">useTimeout</option>
        <option value="useClipboard">useClipboard</option>
        <option value="useMediaQuery">useMediaQuery</option>
        <option value="useOnlineStatus">useOnlineStatus</option>
        <option value="useGeolocation">useGeolocation</option>
        <option value="useTheme">useTheme</option>
      </select>
      <div className="task-box">{renderComponent()}</div>
    </div>
  );
}
