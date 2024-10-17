"use client"
import Image from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

import { useBalance } from '@repo/store/useBalance';


export default function Home() {
  return (
    <div className="text-orange-500">
      {useBalance()}
    </div>
  )
}
