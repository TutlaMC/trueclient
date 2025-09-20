import React, { useState } from "react";
import LiquidGlass from "../LiquidGlass/LiquidGlass";

type ModrinthSegmentProps = {
    logo: string
    id: string
    title: string
    type:string
    description: string
}

export default function ModrinthSegment({logo, id, title, type, description}:ModrinthSegmentProps){
    
    return (
      <LiquidGlass>
        <img src={logo}></img>
        <h1>{title}</h1>
        <p>{description}</p>
      </LiquidGlass>
    )
}