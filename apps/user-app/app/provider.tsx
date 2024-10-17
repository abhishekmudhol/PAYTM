"use client"
import React from "react"
import { RecoilRoot } from "recoil"

export const Provider = ({ children }: {children : React.ReactNode})=>{
    return(
        <>
            <RecoilRoot>
                {children}
            </RecoilRoot>
        </>
    )
}