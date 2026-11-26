// A valid, visibly labelled teaching document. Never resembles a bank receipt.
export function simulationPdf(reference,amount){
 if(!/^DEMO-EXE201-[A-Z0-9_-]+$/i.test(reference)||!Number.isSafeInteger(amount)||amount<=0)throw Error('Invalid simulation document input.');
 const lines=['SIMULATED DEMO ENTRY','NOT A REAL PAYMENT RECEIPT','FitSync EXE201 local teaching dataset',`Reference: ${reference}`,`Illustrative amount: ${amount} VND`,'No funds moved. No bank or customer is represented.','This document must not be used as proof of revenue.'];
 const escape=text=>text.replace(/[\\()]/g,'\\$&');
 const stream=`BT /F1 20 Tf 45 770 Td (${escape(lines[0])}) Tj /F1 12 Tf\n`+lines.slice(1).map(text=>`0 -32 Td (${escape(text)}) Tj`).join('\n')+'\nET\n';
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`];
 let text='%PDF-1.4\n';const offsets=[0];
 objects.forEach((object,i)=>{offsets.push(Buffer.byteLength(text));text+=`${i+1} 0 obj\n${object}\nendobj\n`;});
 const xref=Buffer.byteLength(text);text+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(offset=>`${String(offset).padStart(10,'0')} 00000 n \n`).join('');
 text+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
 return Buffer.from(text);
}
