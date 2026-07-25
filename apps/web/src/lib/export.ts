import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export async function exportJournalPdf(entry: {
  content: string;
  summary?: string | null;
  mood?: string | null;
  entryDate: string;
}) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Project Grayscale — Founder Journal", 20, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(new Date(entry.entryDate).toLocaleString(), 20, 28);
  if (entry.mood) doc.text(`Mood: ${entry.mood}`, 20, 34);

  doc.setTextColor(0);
  doc.setFontSize(12);
  if (entry.summary) {
    doc.setFont("helvetica", "bold");
    doc.text("AI Summary", 20, 46);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(entry.summary, 170);
    doc.text(summaryLines, 20, 54);
  }

  const yStart = entry.summary ? 54 + entry.summary.length / 4 + 10 : 46;
  doc.setFont("helvetica", "bold");
  doc.text("Entry", 20, yStart);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(entry.content, 170);
  doc.text(lines, 20, yStart + 8);

  doc.save(`journal-${entry.entryDate.slice(0, 10)}.pdf`);
}

export async function exportJournalDocx(entry: {
  content: string;
  summary?: string | null;
  mood?: string | null;
  entryDate: string;
}) {
  const children = [
    new Paragraph({
      text: "Project Grayscale — Founder Journal",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [new TextRun({ text: new Date(entry.entryDate).toLocaleString(), italics: true })],
    }),
  ];

  if (entry.mood) {
    children.push(new Paragraph({ children: [new TextRun(`Mood: ${entry.mood}`)] }));
  }
  if (entry.summary) {
    children.push(
      new Paragraph({ text: "AI Summary", heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ children: [new TextRun(entry.summary)] }),
    );
  }
  children.push(
    new Paragraph({ text: "Entry", heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ children: [new TextRun(entry.content)] }),
  );

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `journal-${entry.entryDate.slice(0, 10)}.docx`);
}

export function exportBillsPdf(
  bills: Array<{
    name: string;
    amountCents: number;
    currency: string;
    dueDate: string;
    isPaid: boolean;
    category?: string | null;
  }>,
) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Project Grayscale — Bill Tracker", 20, 20);
  doc.setFontSize(10);
  doc.text(`Generated ${new Date().toLocaleString()}`, 20, 28);

  let y = 40;
  doc.setFontSize(11);
  for (const bill of bills) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const amount = (bill.amountCents / 100).toFixed(2);
    doc.text(
      `${bill.name} — ${bill.currency} ${amount} — Due ${new Date(bill.dueDate).toLocaleDateString()} — ${bill.isPaid ? "Paid" : "Unpaid"}`,
      20,
      y,
    );
    y += 8;
  }
  doc.save("bills-report.pdf");
}

export function exportBillsExcel(
  bills: Array<{
    name: string;
    amountCents: number;
    currency: string;
    dueDate: string;
    recurrence: string;
    isPaid: boolean;
    category?: string | null;
  }>,
) {
  const rows = bills.map((b) => ({
    Name: b.name,
    Amount: b.amountCents / 100,
    Currency: b.currency,
    "Due Date": new Date(b.dueDate).toLocaleDateString(),
    Recurrence: b.recurrence,
    Status: b.isPaid ? "Paid" : "Unpaid",
    Category: b.category ?? "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bills");
  XLSX.writeFile(wb, "bills-report.xlsx");
}
