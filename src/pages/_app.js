import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* nice header */}
      <div className="flex flex-row items-center justify-center w-full h-16 bg-gray-900">
        <h1 className="text-4xl font-bold text-white">Encryptor++</h1>
      </div>
      <Component {...pageProps} />
      {/* footer with tekvek and copyrights */}
      <div className="flex flex-row items-center justify-center w-full h-16 bg-gray-900">
        <span className="text-white">Made with ❤️ by Tekvek.com</span>
      </div>
    </>
  );
}
