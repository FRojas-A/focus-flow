"use client";
import ClassSelector from "@/components/schedule/class-selector";
import YearSelector from "@/components/schedule/year-selector";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export default function SchedulePage() {
    // Column widths: Year selector, Class selector. Class viewer fills remaining space with min 500px.
    const [col1Width, setCol1Width] = useState<number>(280); // Year selector min 196
    const [col2Width, setCol2Width] = useState<number>(500); // Class selector min 280

    // Container ref to compute available width for enforcing viewer min width during drags
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Drag state
    const draggingRef = useRef<null | "left" | "right">(null);
    const startXRef = useRef<number>(0);
    const startWRef = useRef<number>(0);

    // Constants
    const RESIZER_WIDTH = 4;
    const RESIZERS_TOTAL = RESIZER_WIDTH * 2; // two resizers
    const VIEWER_MIN = 500;

    // Helpers to clamp widths
    const clampLeft = (tentative: number) => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        const maxAllowed = Math.max(
            196,
            containerWidth - RESIZERS_TOTAL - VIEWER_MIN - col2Width
        );
        return Math.max(196, Math.min(tentative, maxAllowed));
    };
    const clampRight = (tentative: number) => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        const maxAllowed = Math.max(
            280,
            containerWidth - RESIZERS_TOTAL - VIEWER_MIN - col1Width
        );
        return Math.max(280, Math.min(tentative, maxAllowed));
    };

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!draggingRef.current) return;
            const dx = e.clientX - startXRef.current;
            if (draggingRef.current === "left") {
                const tentative = startWRef.current + dx;
                const next = clampLeft(tentative);
                setCol1Width(next);
            } else if (draggingRef.current === "right") {
                const tentative = startWRef.current + dx;
                const next = clampRight(tentative);
                setCol2Width(next);
            }
        };
        const onTouchMove = (e: TouchEvent) => {
            if (!draggingRef.current) return;
            if (e.touches.length === 0) return;
            const x = e.touches[0]?.clientX ?? 0;
            const dx = x - startXRef.current;
            if (draggingRef.current === "left") {
                const tentative = startWRef.current + dx;
                const next = clampLeft(tentative);
                setCol1Width(next);
            } else if (draggingRef.current === "right") {
                const tentative = startWRef.current + dx;
                const next = clampRight(tentative);
                setCol2Width(next);
            }
            // Prevent scrolling while resizing
            e.preventDefault();
        };
        const onMouseUp = () => {
            draggingRef.current = null;
        };
        const onTouchEnd = () => {
            draggingRef.current = null;
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, []);

    // Re-clamp widths on resize to preserve viewer >= 500
    useEffect(() => {
        const handler = () => {
            const containerWidth = containerRef.current?.clientWidth ?? 0;
            // Ensure col1 and col2 are not exceeding what's allowed
            const maxCol1 = Math.max(196, containerWidth - RESIZERS_TOTAL - VIEWER_MIN - col2Width);
            const newCol1 = Math.min(Math.max(col1Width, 196), maxCol1);
            const maxCol2 = Math.max(280, containerWidth - RESIZERS_TOTAL - VIEWER_MIN - newCol1);
            const newCol2 = Math.min(Math.max(col2Width, 280), maxCol2);
            if (newCol1 !== col1Width) setCol1Width(newCol1);
            if (newCol2 !== col2Width) setCol2Width(newCol2);
        };
        window.addEventListener("resize", handler);
        // Run once on mount
        handler();
        return () => window.removeEventListener("resize", handler);
    }, [col1Width, col2Width]);

    // Persist widths to localStorage and load on mount
    useEffect(() => {
        const key1 = "schedule.col1Width";
        const key2 = "schedule.col2Width";
        // Load
        try {
            const s1 = localStorage.getItem(key1);
            const s2 = localStorage.getItem(key2);
            if (s1) {
                const v1 = parseInt(s1, 10);
                if (!Number.isNaN(v1)) setCol1Width(v1);
            }
            if (s2) {
                const v2 = parseInt(s2, 10);
                if (!Number.isNaN(v2)) setCol2Width(v2);
            }
        } catch {}
        // No cleanup
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem("schedule.col1Width", String(col1Width));
            localStorage.setItem("schedule.col2Width", String(col2Width));
        } catch {}
    }, [col1Width, col2Width]);

    const startDrag = (which: "left" | "right") => (e: React.MouseEvent<HTMLDivElement>) => {
        draggingRef.current = which;
        startXRef.current = e.clientX;
        startWRef.current = which === "left" ? col1Width : col2Width;
        // Prevent text selection while dragging
        e.preventDefault();
    };

    const startTouchDrag = (which: "left" | "right") => (e: React.TouchEvent<HTMLDivElement>) => {
        draggingRef.current = which;
        const x = e.touches[0]?.clientX ?? 0;
        startXRef.current = x;
        startWRef.current = which === "left" ? col1Width : col2Width;
        e.preventDefault();
    };

    // Keyboard accessibility for resizers
    const onLeftKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const step = e.shiftKey ? 16 : 8;
        if (e.key === "ArrowLeft") {
            setCol1Width(prev => clampLeft(prev - step));
            e.preventDefault();
        } else if (e.key === "ArrowRight") {
            setCol1Width(prev => clampLeft(prev + step));
            e.preventDefault();
        } else if (e.key === "Home") {
            setCol1Width(196);
            e.preventDefault();
        } else if (e.key === "End") {
            // Max allowed based on current layout
            const containerWidth = containerRef.current?.clientWidth ?? 0;
            const maxAllowed = Math.max(196, containerWidth - RESIZERS_TOTAL - VIEWER_MIN - col2Width);
            setCol1Width(maxAllowed);
            e.preventDefault();
        }
    };
    const onRightKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const step = e.shiftKey ? 16 : 8;
        if (e.key === "ArrowLeft") {
            setCol2Width(prev => clampRight(prev - step));
            e.preventDefault();
        } else if (e.key === "ArrowRight") {
            setCol2Width(prev => clampRight(prev + step));
            e.preventDefault();
        } else if (e.key === "Home") {
            setCol2Width(280);
            e.preventDefault();
        } else if (e.key === "End") {
            const containerWidth = containerRef.current?.clientWidth ?? 0;
            const maxAllowed = Math.max(280, containerWidth - RESIZERS_TOTAL - VIEWER_MIN - col1Width);
            setCol2Width(maxAllowed);
            e.preventDefault();
        }
    };

    return (
        <main
            ref={containerRef}
            className="w-full grid h-[calc(100vh-4rem)]"
            style={{
                gridTemplateColumns: `${col1Width}px 4px ${col2Width}px 4px minmax(500px, 1fr)`,
            }}
        >
            {/* Year selector */}
            <div className="col-start-1 min-w-[196px] overflow-hidden">
                <YearSelector />
            </div>

            {/* Resizer between Year and Class selectors */}
            <div
                className="col-start-2 cursor-col-resize bg-border hover:bg-border/50 transition-colors"
                onMouseDown={startDrag("left")}
                onTouchStart={startTouchDrag("left")}
                onKeyDown={onLeftKeyDown}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize year and class selectors"
                tabIndex={0}
                aria-valuemin={196}
                aria-valuemax={(containerRef.current?.clientWidth ?? 0) - RESIZERS_TOTAL - VIEWER_MIN - col2Width}
                aria-valuenow={col1Width}
            />

            {/* Class selector */}
            <div className="col-start-3 min-w-[280px] overflow-hidden">
                <ClassSelector />
            </div>

            {/* Resizer between Class selector and Viewer */}
            <div
                className="col-start-4 cursor-col-resize bg-border hover:bg-border/50 transition-colors"
                onMouseDown={startDrag("right")}
                onTouchStart={startTouchDrag("right")}
                onKeyDown={onRightKeyDown}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize class selector and viewer"
                tabIndex={0}
                aria-valuemin={280}
                aria-valuemax={(containerRef.current?.clientWidth ?? 0) - RESIZERS_TOTAL - VIEWER_MIN - col1Width}
                aria-valuenow={col2Width}
            />

            {/* Class viewer */}
            <div id="class-viewer" className="col-start-5 min-w-[500px] overflow-auto" />
        </main>
    );
}