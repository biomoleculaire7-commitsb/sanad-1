import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PdfExportOptions {
  fileName?: string;
  title?: string;
  author?: string;
  subject?: string;
}

/**
 * Exports an HTML element as an organized, high-resolution A4 PDF document using jsPDF & html2canvas.
 * Specially tuned for Arabic typography, tables, and multi-page pedagogical fiches.
 */
export async function exportFicheToPdf(
  elementId: string,
  options: PdfExportOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found.`);
  }

  // 1. Create a clean container clone for rendering to prevent visual artifacts
  // and guarantee crisp, official print aesthetics regardless of user reading mode / dark themes.
  const originalDir = element.getAttribute("dir") || "rtl";
  const isLtr = originalDir === "ltr";

  // Create an off-screen clone with exact fixed A4 printable width (approx 820px)
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = "fiche-pdf-export-clone";
  clone.style.position = "fixed";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.width = "820px";
  clone.style.maxWidth = "820px";
  clone.style.minWidth = "820px";
  clone.style.backgroundColor = "#ffffff";
  clone.style.color = "#0f172a"; // slate-900
  clone.style.boxSizing = "border-box";
  clone.style.padding = "24px";
  clone.style.borderRadius = "0px";
  clone.style.border = "1px solid #cbd5e1";
  clone.style.boxShadow = "none";
  clone.style.overflow = "visible";
  clone.style.zIndex = "-1000";

  // Remove any elements with print:hidden or interactive buttons inside the clone
  const hiddenElements = clone.querySelectorAll(".print\\:hidden, button, [data-pdf-ignore]");
  hiddenElements.forEach((el) => el.remove());

  // Ensure all texts and backgrounds in clone are high-contrast printable
  const allSubContainers = clone.querySelectorAll<HTMLElement>("*");
  allSubContainers.forEach((el) => {
    // If elements had dark backgrounds from reading mode, reset them
    const bg = window.getComputedStyle(el).backgroundColor;
    if (bg.includes("rgba(0, 0, 0") || bg.includes("rgb(15, 23, 42)") || bg.includes("rgb(22, 34, 56)")) {
      el.style.backgroundColor = "#ffffff";
      el.style.color = "#0f172a";
    }
  });

  document.body.appendChild(clone);

  try {
    // 2. Render clone using html2canvas with scale 2 for retina/print crispness
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 820,
    });

    // 3. Set up jsPDF for standard A4 portrait (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // Set document metadata
    if (options.title) pdf.setProperties({ title: options.title });
    if (options.author) pdf.setProperties({ author: options.author });
    if (options.subject) pdf.setProperties({ subject: options.subject });
    pdf.setProperties({ creator: "سند - المنصة التربوية لإعداد المذكرات البيداغوجية" });

    const pageWidth = 210; // mm
    const pageHeight = 297; // mm
    const margin = 8; // mm outer margin
    const usableWidth = pageWidth - margin * 2; // 194 mm
    const usableHeight = pageHeight - margin * 2; // 281 mm

    // Canvas aspect ratio calculations
    const canvasWidth = canvas.width;
    const canvasTotalHeight = canvas.height;
    // Calculate how many canvas pixels correspond to one full page's usable height
    const sliceHeightPx = Math.floor((canvasWidth * usableHeight) / usableWidth);

    let currentY = 0;
    let pageIndex = 0;
    const totalPages = Math.ceil(canvasTotalHeight / sliceHeightPx);

    while (currentY < canvasTotalHeight) {
      const remainingHeightPx = canvasTotalHeight - currentY;
      const thisSliceHeightPx = Math.min(sliceHeightPx, remainingHeightPx);

      // Create a slice canvas for this page
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvasWidth;
      sliceCanvas.height = thisSliceHeightPx;
      const ctx = sliceCanvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          currentY,
          canvasWidth,
          thisSliceHeightPx, // source coords
          0,
          0,
          canvasWidth,
          thisSliceHeightPx // dest coords
        );
      }

      const imgData = sliceCanvas.toDataURL("image/jpeg", 0.96);
      const sliceHeightInMm = (thisSliceHeightPx * usableWidth) / canvasWidth;

      if (pageIndex > 0) {
        pdf.addPage("a4", "portrait");
      }

      // Add image centered within margins
      pdf.addImage(
        imgData,
        "JPEG",
        margin,
        margin,
        usableWidth,
        sliceHeightInMm,
        undefined,
        "FAST"
      );

      // Add discrete page number at bottom margin
      pdf.setFontSize(8);
      pdf.setTextColor(140, 150, 165);
      const pageNumberText = isLtr
        ? `Page ${pageIndex + 1} / ${totalPages} • SANAD Education`
        : `صفحة ${pageIndex + 1} من ${totalPages} • منصة سند التربوية`;
      
      if (isLtr) {
        pdf.text(pageNumberText, margin, pageHeight - 4);
      } else {
        pdf.text(pageNumberText, pageWidth - margin, pageHeight - 4, { align: "right" });
      }

      currentY += thisSliceHeightPx;
      pageIndex++;
    }

    // 4. Download PDF
    const cleanFileName = (options.fileName || "مذكرة_بيداغوجية.pdf").endsWith(".pdf")
      ? options.fileName || "مذكرة_بيداغوجية.pdf"
      : `${options.fileName || "مذكرة_بيداغوجية"}.pdf`;

    pdf.save(cleanFileName);
  } finally {
    // Always clean up clone element from DOM
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}
