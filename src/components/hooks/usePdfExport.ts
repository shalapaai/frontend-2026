import { useCallback, useEffect, useRef, useState } from "react";
import type { Presentation } from "../../types/presentation";
import type { Slide } from "../../types/slide";

async function loadImage(src: string): Promise<HTMLImageElement> {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    await image.decode();
    return image;
}

async function renderSlide(slide: Slide, host: HTMLDivElement) {
    const element = document.createElement("div");
    Object.assign(element.style, {
        position: "relative",
        width: `${slide.width}px`,
        height: `${slide.height}px`,
        overflow: "hidden",
        backgroundColor: "#fff",
    });
    host.replaceChildren(element);

    if (slide.background.type === "color") {
        element.style.backgroundColor = slide.background.color;
    } else if (slide.background.type === "gradient") {
        element.style.backgroundImage = slide.background.gradientType === "radial"
            ? `radial-gradient(ellipse at center, ${slide.background.colors.join(", ")})`
            : `linear-gradient(${slide.background.angle}deg, ${slide.background.colors.join(", ")})`;
    } else {
        const background = await loadImage(slide.background.src);
        Object.assign(background.style, {
            position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover",
        });
        element.append(background);
    }

    for (const object of slide.objects) {
        const child = object.type === "image"
            ? await loadImage(object.src)
            : document.createElement("div");

        Object.assign(child.style, {
            position: "absolute",
            left: `${object.x}px`,
            top: `${object.y}px`,
            width: `${object.width}px`,
            height: `${object.height}px`,
            margin: "0",
            padding: "0",
            border: "none",
            boxSizing: "border-box",
            overflow: "hidden",
        });

        if (object.type === "text") {
            child.textContent = object.text;
            Object.assign(child.style, {
                fontFamily: object.fontFamily,
                fontSize: `${object.fontSize}px`,
                fontWeight: "400",
                lineHeight: "normal",
                color: object.fontColor,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
            });
        } else {
            child.style.objectFit = "contain";
        }
        element.append(child);
    }
    await document.fonts.ready;
    return element;
}

function usePdfExport() {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const busyRef = useRef(false);
    const mountedRef = useRef(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            hostRef.current?.remove();
            hostRef.current = null;
        };
    }, []);

    const exportToPdf = useCallback(async (presentation: Presentation) => {
        if (busyRef.current) return;
        if (!presentation.slides.length) throw new Error("В презентации нет слайдов");
        busyRef.current = true;
        setIsExporting(true);

        const host = document.createElement("div");
        Object.assign(host.style, {
            position: "absolute", left: "-100000px", top: "0", pointerEvents: "none",
        });
        host.setAttribute("aria-hidden", "true");
        hostRef.current = host;
        document.body.append(host);

        try {
            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
                import("html2canvas"), import("jspdf"),
            ]);
            const first = presentation.slides[0];
            const pdf = new jsPDF({
                unit: "px",
                format: [first.width, first.height],
                orientation: first.width >= first.height ? "landscape" : "portrait",
                hotfixes: ["px_scaling"],
                compress: true,
            });

            for (const [index, slide] of presentation.slides.entries()) {
                if (!mountedRef.current) return;
                const element = await renderSlide(slide, host);
                const canvas = await html2canvas(element, {
                    scale: 2, useCORS: true, logging: false,
                    width: slide.width, height: slide.height,
                });
                if (index > 0) {
                    pdf.addPage(
                        [slide.width, slide.height],
                        slide.width >= slide.height ? "landscape" : "portrait",
                    );
                }
                pdf.addImage(canvas, "PNG", 0, 0, slide.width, slide.height);
                canvas.width = 0;
                canvas.height = 0;
            }
            if (mountedRef.current) pdf.save(`${presentation.name}.pdf`);
        } finally {
            host.remove();
            if (hostRef.current === host) hostRef.current = null;
            busyRef.current = false;
            if (mountedRef.current) setIsExporting(false);
        }
    }, []);

    return { exportToPdf, isExporting };
}

export { usePdfExport };
