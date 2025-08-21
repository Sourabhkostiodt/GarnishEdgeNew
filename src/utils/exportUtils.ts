import { downloadExcel } from 'react-export-table-to-excel';

export type ExportColumn = { accessor: string; title?: string };

function capitalize(s: string) {
    return s
        .replace('-', ' ')
        .toLowerCase()
        .split(' ')
        .map((str) => str.charAt(0).toUpperCase() + str.substring(1))
        .join(' ');
}

export function exportTable(type: 'csv' | 'txt' | 'print', columns: ExportColumn[], records: any[], filename = 'table') {
    let colKeys = columns.map((c) => c.accessor);
    let colTitles = columns.map((c) => c.title || capitalize(c.accessor));
    let newVariable: any = window.navigator;

    if (type === 'csv' || type === 'txt') {
        let coldelimiter = type === 'csv' ? ',' : ';';
        let linedelimiter = '\n';
        let result = colTitles.join(coldelimiter) + linedelimiter;
        records.forEach((item) => {
            result += colKeys.map((key) => {
                let value = item[key];
                if (typeof value === 'string') return '"' + value.replace(/"/g, '""') + '"';
                if (value == null) return '';
                return value;
            }).join(coldelimiter) + linedelimiter;
        });
        if (!result) return;
        let mime = type === 'csv' ? 'text/csv' : 'text/txt';
        if (!result.match(/^data:text\/(csv|txt)/i) && !newVariable.msSaveOrOpenBlob) {
            let data = `data:${mime};charset=utf-8,` + encodeURIComponent(result);
            let link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', filename + (type === 'csv' ? '.csv' : '.txt'));
            link.click();
        } else {
            let blob = new Blob([result]);
            if (newVariable.msSaveOrOpenBlob) {
                newVariable.msSaveBlob(blob, filename + (type === 'csv' ? '.csv' : '.txt'));
            }
        }
    } else if (type === 'print') {
        let rowhtml = `<p>${filename}</p>`;
        rowhtml += '<table style="width: 100%;" cellpadding="0" cellspacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact;">';
        colTitles.forEach((d) => {
            rowhtml += `<th>${d}</th>`;
        });
        rowhtml += '</tr></thead>';
        records.forEach((item) => {
            rowhtml += '<tr>';
            colKeys.forEach((key) => {
                rowhtml += `<td>${item[key] ?? ''}</td>`;
            });
            rowhtml += '</tr>';
        });
        rowhtml += '</table>';
        let printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>' + filename + '</title></head><body >');
            printWindow.document.write(rowhtml);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }
}

export function handleDownloadExcel(columns: ExportColumn[], records: any[], filename = 'table') {
    const header = columns.map((c) => c.title || capitalize(c.accessor));
    downloadExcel({
        fileName: filename,
        sheet: 'Sheet1',
        tablePayload: {
            header,
            body: records,
        },
    });
}
