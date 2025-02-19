"use client";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "./constants";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Arrow,
  Transformer,
} from "react-konva";
import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";

interface Shape {
  id: string;
  x: number;
  y: number;
  fill: string;
}

interface Rectangle extends Shape {
  width: number;
  height: number;
}

interface CircleShape extends Shape {
  radius: number;
}

interface ArrowShape extends Shape {
  points: number[];
}

interface Scribble extends Shape {
  points: number[];
}

interface AppState {
  rectangles: Rectangle[];
  circles: CircleShape[];
  arrows: ArrowShape[];
  scribbles: Scribble[];
}

interface HistoryState {
  history: AppState[];
  currentIndex: number;
}

const initialAppState: AppState = {
  rectangles: [],
  circles: [],
  arrows: [],
  scribbles: [],
};

export default function Home() {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const currentShapeId = useRef<string | null>(null);
  const isPaining = useRef<boolean>(false);
  const historyStateRef = useRef<HistoryState>({
    history: [initialAppState],
    currentIndex: 0,
  });

  const [action, setAction] = useState<string>(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState<string>("#ff0000");
  const [draftState, setDraftState] = useState<AppState | null>(null);

  const [historyState, setHistoryState] = useState<HistoryState>(() => {
    if (typeof window === 'undefined') {
      return {
        history: [initialAppState],
        currentIndex: 0,
      };
    }
    const savedHistory = localStorage.getItem("drawingHistory");
    const savedIndex = localStorage.getItem("drawingHistoryIndex");
    if (savedHistory && savedIndex !== null) {
      return {
        history: JSON.parse(savedHistory),
        currentIndex: parseInt(savedIndex),
      };
    }
    return {
      history: [initialAppState],
      currentIndex: 0,
    };
  });
  

  useEffect(() => {
    historyStateRef.current = historyState;
    localStorage.setItem("drawingHistory", JSON.stringify(historyState.history));
    localStorage.setItem(
      "drawingHistoryIndex",
      historyState.currentIndex.toString()
    );
  }, [historyState]);

  const currentAppState = historyState.history[historyState.currentIndex];
  const currentState = draftState || currentAppState;
  const strokeColor = "#000";
  const isDraggable = action === ACTIONS.SELECT;

  function handleExport() {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function onClick(e: KonvaEventObject<Event>) {
    if (action !== ACTIONS.SELECT || !transformerRef.current) return;
    transformerRef.current.nodes([e.currentTarget]);
  }

  function onPointerDown() {
    if (action === ACTIONS.SELECT || !stageRef.current) return; 

    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const { x, y } = pos;
    const id = uuidv4();
    currentShapeId.current = id;
    isPaining.current = true;

    const draft = { ...currentAppState };

    switch (action) {
      case ACTIONS.RECTANGLE:
        draft.rectangles = [
          ...draft.rectangles,
          { id, x, y, width: 0, height: 0, fill: fillColor },
        ];
        break;
      case ACTIONS.CIRCLE:
        draft.circles = [
          ...draft.circles,
          { id, x, y, radius: 0, fill: fillColor },
        ];
        break;
    }

    setDraftState(draft);
  }

  function onPointerMove() {
    if (!isPaining.current || !draftState || !stageRef.current) return;

    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const { x, y } = pos;
    const updatedDraft = { ...draftState };

    switch (action) {
      case ACTIONS.RECTANGLE:
        updatedDraft.rectangles = updatedDraft.rectangles.map((rect) =>
          rect.id === currentShapeId.current
            ? { ...rect, width: x - rect.x, height: y - rect.y }
            : rect
        );
        break;
      case ACTIONS.CIRCLE:
        updatedDraft.circles = updatedDraft.circles.map((circ) =>
          circ.id === currentShapeId.current
            ? { ...circ, radius: Math.hypot(x - circ.x, y - circ.y) }
            : circ
        );
        break;
    }

    setDraftState(updatedDraft);
  }

  function onPointerUp() {
    if (!draftState) return;

    isPaining.current = false;
    setHistoryState((prev) => {
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);
      newHistory.push(draftState);
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    });
    setDraftState(null);
  }


  useEffect(() => {
    if (typeof window === "undefined") return;
  
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
  
        if (e.key === "z") {
          setHistoryState((prev) => ({
            ...prev,
            currentIndex: Math.max(prev.currentIndex - 1, 0),
          }));
        } else if (e.key === "y") {
          setHistoryState((prev) => ({
            ...prev,
            currentIndex: Math.min(prev.currentIndex + 1, prev.history.length - 1),
          }));
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">

      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex text-[#222] justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
          {[
            { icon: <GiArrowCursor size={"2rem"} />, type: ACTIONS.SELECT },
            { icon: <TbRectangle size={"2rem"} />, type: ACTIONS.RECTANGLE },
            { icon: <FaRegCircle size={"1.5rem"} />, type: ACTIONS.CIRCLE },
          ].map(({ icon, type }) => (
            <button
              key={type}
              className={`p-2 rounded ${
                action === type ? "bg-[#0a66c2] !text-[#fff]" : "bg-white"
              }`}
              onClick={() => setAction(type)}
            >
              {icon}
            </button>
          ))}
          <input
            className="w-[30px]"
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
          />
          <button onClick={handleExport}>
            <IoMdDownload size={"1.5rem"} />
          </button>
        </div>
      </div>

      <Stage
        ref={stageRef}
        width={typeof window === "undefined" ? 0 : window.innerWidth}
        height={typeof window === "undefined" ? 0 : window.innerHeight}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <Layer>
          {currentState.rectangles.map((rect) => (
            <Rect
              key={rect.id}
              {...rect}
              fill={rect.fill}
              stroke={strokeColor}
              draggable={isDraggable}
              onClick={onClick}
            />
          ))}
          {currentState.circles.map((circ) => (
            <Circle
              key={circ.id}
              {...circ}
              fill={circ.fill}
              stroke={strokeColor}
              draggable={isDraggable}
              onClick={onClick}
            />
          ))}
          {currentState.arrows.map((arr) => (
            <Arrow
              key={arr.id}
              {...arr}
              fill={arr.fill}
              stroke={strokeColor}
              draggable={isDraggable}
              onClick={onClick}
            />
          ))}
          {currentState.scribbles.map((scr) => (
            <Line
              key={scr.id}
              {...scr}
              stroke={strokeColor}
              draggable={isDraggable}
              onClick={onClick}
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
}