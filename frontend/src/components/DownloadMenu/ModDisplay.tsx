import React, { useState } from "react";
import LiquidGlass from "../LiquidGlass/LiquidGlass";

type ModDisplayProps = {
    logo: string
    id: string
    title: string
    type:string
    description: string
}

export default function ModDisplay({logo, id, title, type, description}:ModDisplayProps){
    
    return (
      <LiquidGlass>
        <img src={logo}></img>
        <h1>{title}</h1>
        <p>{description}</p>
      </LiquidGlass>
    )
}