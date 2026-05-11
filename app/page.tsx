"use client";
import React, { useState } from "react";

export default function App() {
const [activeDay, setActiveDay] = useState<number | null>(null);
  const workout = [
    { day: "Lunedì", muscle: "Petto & Tricipiti", ex: ["Panca Piana 4x8", "Panca Inclinata Manubri 3x10", "Dips 3xMax"] },
    { day: "Martedì", muscle: "Dorso & Bicipiti", ex: ["Trazioni 4xMax", "Stacco da terra 3x5", "Rematore Bilanciere 4x10"] },
    { day: "Mercoledì", muscle: "Gambe (Focus Quad)", ex: ["Squat 4x8", "Leg Press 3x12", "Leg Extension 4x15"] },
    { day: "Giovedì", muscle: "Spalle & Addome", ex: ["Military Press 4x8", "Alzate Laterali 4x15", "Plank 3x1min"] },
    { day: "Venerdì", muscle: "Petto & Dorso", ex: ["Croci Manubri 3x12", "Lat Machine 4x10", "Pulley Basso 3x12"] },
    { day: "Sabato", muscle: "Gambe (Femorali) & Braccia", ex: ["Stacco Rumeno 4x10", "Curl Bilanciere 4x12", "Pushdown Tricipiti 4x12"] }
  ];

  return (
    <div style={{background:"#000", color:"#fff", minHeight:"100vh", fontFamily:"sans-serif", padding:"20px"}}>
      <header style={{textAlign:"center", marginBottom:"40px", paddingTop:"20px"}}>
        <h1 style={{fontSize:"2.2rem", fontWeight:"bold", letterSpacing:"-1px", margin:"0"}}>RBATI <span style={{color:"#666"}}>FITNESS</span></h1>
        <p style={{color:"#444", fontSize:"0.8rem", textTransform:"uppercase", letterSpacing:"2px", marginTop:"5px"}}>V-Taper Protocol Online</p>
      </header>
      <div style={{maxWidth:"450px", margin:"0 auto", display:"grid", gap:"12px"}}>
        {workout.map((w, i) => (
          <div key={i} onClick={() => setActiveDay(activeDay === i ? null : i)} style={{background:"#111", border:"1px solid #222", borderRadius:"16px", padding:"20px", cursor:"pointer"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <span style={{fontSize:"0.7rem", color:"#555", textTransform:"uppercase", fontWeight:"bold"}}>{w.day}</span>
                <h3 style={{margin:"4px 0 0 0", fontSize:"1.2rem", color:"#eee"}}>{w.muscle}</h3>
              </div>
              <span style={{fontSize:"1.5rem", color:"#333"}}>{activeDay === i ? "−" : "+"}</span>
            </div>
            {activeDay === i && (
              <div style={{marginTop:"15px", borderTop:"1px solid #222", paddingTop:"15px"}}>
                <ul style={{margin:0, paddingLeft:"15px", color:"#999", lineHeight:"2"}}>
                  {w.ex.map((e, idx) => <li key={idx}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}