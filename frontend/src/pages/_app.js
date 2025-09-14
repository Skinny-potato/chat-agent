import { ChatProvider } from "../context/ChatContext";
import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <ChatProvider>
      <Component {...pageProps} />
    </ChatProvider>
  );
}
