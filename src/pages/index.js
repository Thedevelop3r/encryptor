import React, { useState } from "react";
import crypto from "crypto";

import { ContainerCol } from "../components/Container";

export default function Home() {
  const [envs, setEnvs] = useState([]);
  const [password, setPassword] = useState({
    password: "",
    locked: false,
  });
  const [form, setForm] = useState({
    envName: "",
    envValue: "",
  });
  const [error, setError] = useState({
    message: "",
    show: false,
  });

  function showError(message) {
    setError({ message: message, show: true });
    setTimeout(() => {
      setError({ message: "", show: false });
    }, 3000);
  }

  function EncryptKey(e) {
    e.preventDefault();
    if (password.password.length < 8) {
      showError("You must lock your password first");
      return;
    }
    if (form.envName === "") {
      showError("You must enter a env name");
      return;
    }
    if (form.envValue === "") {
      showError("You must enter a env value");
      return;
    }
    // encrypt key using crypto and password
    const cipher = crypto.createCipher("aes-256-cbc", password.password);
    let encrypted = cipher.update(form.envValue, "utf8", "hex");
    encrypted += cipher.final("hex");
    setEnvs([...envs, { [form.envName]: encrypted }]);
    setForm({ envName: "", envValue: "" });
  }
  function DecryptKey(key) {
    // decrypt key using crypto and password
    const decipher = crypto.createDecipher("aes-256-cbc", password.password);
    let decrypted = decipher.update(key, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  function OnUpdatePassword() {
    if (password.password.length < 8) {
      showError("Password must be at least 8 characters long");
      return;
    }
    setPassword({ ...password, locked: true });
    setEnvs([{ DECRIPTOR_KEY: password.password }]);
  }

  function ExportEnvsToDotEnv() {
    let envString = "";
    envs.forEach((env) => {
      const name = Object.keys(env)[0];
      const value = Object.values(env)[0];
      envString += `${name}=${value}\n`;
    });
    const element = document.createElement("a");
    const file = new Blob([envString], { type: "text/plain" });
    // set file extension to .env
    element.href = URL.createObjectURL(file);
    element.download = ".env.example";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  function ExportToJson() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(envs)], { type: "text/plain" });
    // set file extension to .env
    element.href = URL.createObjectURL(file);
    element.download = "envs.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  function delEnv(envName) {
    setEnvs(envs.filter((env) => Object.keys(env)[0] !== envName));
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-12 bg-slate-100`}>
      <div className={`fixed bottom-0 right-0 w-1/4 p-4 bg-red-900 rounded-lg ${error.show ? "flex" : "hidden"}`}>
        <span className="text-white">{error.message}</span>
      </div>
      <ContainerCol>
        <div className="flex flex-col items-center justify-center bg-white">
          <h1 className="text-3xl font-bold text-gray-900 my-2">Encrypt Your Secrets</h1>
          <form className="flex flex-col items-center justify-center w-full p-8 bg-white rounded-lg shadow-lg">
            <label className="flex flex-col items-start justify-start w-full mt-4">
              <span className="text-gray-900 text-2xl">Password</span>
              <input
                type="password"
                value={password.password}
                id="password"
                disabled={password.locked}
                onChange={(e) => setPassword({ ...password, password: e.target.value })}
                placeholder={password.locked ? "Password Locked" : "your password..."}
                className="w-full cursor-pointer px-3 py-2 mt-1 text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
              />
              <button
                type="button"
                onClick={
                  password.locked
                    ? () => {
                        navigator.clipboard.writeText(password.password);
                      }
                    : OnUpdatePassword
                }
                // disabled={password.locked}
                className="w-1/4 font-bold px-3 py-2 mt-1 self-center text-white border bg-blue-600 rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
              >
                {password.locked ? "Copy To Clipboard" : "Lock Password"}
              </button>
            </label>
            <label className="flex flex-col items-start justify-start w-full mt-10">
              <span className="text-gray-900 text-2xl">Env Name</span>
              <input
                type="text"
                value={form.envName}
                id="envName"
                onChange={(e) => {
                  const regex = /^[a-zA-Z0-9_]*$/;
                  if (!regex.test(e.target.value)) {
                    showError("Env name must be alphanumeric");
                    return;
                  }

                  setForm({ ...form, envName: e.target.value.toUpperCase() });
                }}
                placeholder="your envoirment variable name, eg: THIRD_PARTY_KEY, AWS_SECRET_KEY, etc..."
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
              />
            </label>
            <label className="flex flex-col items-start justify-start w-full">
              <span className="text-gray-900 text-2xl">Secret</span>
              <input
                type="text"
                value={form.envValue}
                id="envValue"
                onChange={(e) => {
                  // space not allowed
                  const regex = /^[^\s]*$/;
                  if (!regex.test(e.target.value)) {
                    showError("Space not allowed");
                    return;
                  }
                  setForm({ ...form, envValue: e.target.value });
                }}
                placeholder="your private key..."
                className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
              />
            </label>
            {/* password to encrypt */}
            <button
              type="button"
              onClick={EncryptKey}
              className="w-1/4 self-center font-bold px-3 py-2 mt-1 text-white border bg-green-900 rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            >
              Encrypt
            </button>
          </form>
        </div>
        <h1 className="text-3xl text-center font-bold text-gray-900 my-2">Your Secrets</h1>
        {envs && envs.length > 0 && (
          <>
            <button
              type="button"
              onClick={ExportEnvsToDotEnv}
              className="w-[150px] self-center font-bold px-2 py-2 text-white border bg-slate-700 rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            >
              Export To .env
            </button>
            <button
              type="button"
              onClick={ExportToJson}
              className="w-[150px] self-center font-bold px-2 py-2 text-white border bg-slate-700 rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            >
              Export To JSON
            </button>
          </>
        )}
        <div className="flex flex-col items-start justify-start bg-white px-4">
          {envs &&
            envs.length > 0 &&
            envs.map((env, index) => {
              const name = Object.keys(env)[0];
              const value = Object.values(env)[0];
              return <EnvItem key={name} name={name} value={value} DecryptKey={DecryptKey} delEnv={delEnv} />;
            })}
        </div>
      </ContainerCol>
    </main>
  );
}

function EnvItem({ name, value, DecryptKey, delEnv }) {
  return (
    <div className="flex flex-row flex-nowrap gap-1 w-full justify-between items-start border-b-2 border-slate-500 py-2">
      <h2 className="text-sm font-bold text-gray-900 my-2 w-[350px] break-all">{name}</h2>
      <p id={name} className="text-sm text-center font-bold text-green-900 bg-green-50 my-2 px-2 w-[100%] break-all">
        {value}
      </p>

      <div className="flex flex-row gap-1 w-[100px]">
        {/* copy icon svg, click to value copy to clipboard */}
        <div
          title="Copy to clipboard"
          onClick={() => {
            navigator.clipboard.writeText(value);
            const element = document.getElementById(name);
            element.classList.add("bg-black");
            element.classList.add("text-white");
            element.classList.remove("bg-green-50");
            element.classList.remove("text-green-900");
            setTimeout(() => {
              element.classList.add("bg-green-50");
              element.classList.add("text-green-900");
              element.classList.remove("bg-black");
              element.classList.remove("text-white");
            }, 1000);
          }}
          className="flex flex-row items-center justify-center w-8 h-8 bg-gray-900 rounded-lg cursor-pointer"
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M13.707 3.293a1 1 0 010 1.414L7.414 12H9a1 1 0 110 2H5a1 1 0 01-1-1V9a1 1 0 112 0v1.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        {name !== "DECRIPTOR_KEY" && (
          <>
            <button
              onClick={() => {
                alert(DecryptKey(value));
              }}
              className="p-1 bg-orange-500 rounded-md text-white"
            >
              Key
            </button>
            <button
              onClick={() => {
                delEnv(name);
              }}
              className="p-1 bg-red-500 rounded-md text-white"
            >
              Del
            </button>
          </>
        )}
      </div>
    </div>
  );
}
