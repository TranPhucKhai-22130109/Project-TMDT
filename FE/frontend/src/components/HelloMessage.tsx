"use client";

import { useEffect, useState } from "react";
import { helloService } from "@/services/helloService";

export default function HelloMessage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    helloService.getMessage().then((data) => setMessage(data.message));
  }, []);

  return <h1>{message || "Loading..."}</h1>;
}
