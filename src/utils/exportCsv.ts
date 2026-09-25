export interface CsvReport {
    title: string;
    slug: string;
    regionId: string;
    columns: string[];
    rows: (string | number)[][];
    totals?: [string, string | number][];
}

const cell = (value: string | number) => {
    const text = String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const line = (cells: (string | number)[]) => cells.map(cell).join(',');

const todayStamp = () => new Date().toISOString().slice(0, 10);

export function exportCsvReport(report: CsvReport): string {
    const lines: string[] = [
        line([report.title]),
        line(['Región', report.regionId]),
        line(['Generado', new Date().toLocaleString()]),
        '',
        line(report.columns),
        ...report.rows.map(line),
    ];

    if (report.totals?.length) {
        lines.push('', ...report.totals.map(([label, value]) => line([label, value])));
    }

    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const fileName = `cloudops-${report.slug}-${report.regionId}-${todayStamp()}.csv`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);

    return fileName;
}