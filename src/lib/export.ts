import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (data: any[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte de Inversiones');

  // 1. Configuración de Columnas
  const columns = Object.keys(data[0] || {}).map(key => ({
    header: key.toUpperCase(),
    key: key,
    width: 25
  }));
  worksheet.columns = columns;

  // 2. Diseño del Encabezado Principal (WealthPort)
  worksheet.insertRow(1, ['WEALTHPORT | Gestión de Inversiones']);
  worksheet.mergeCells('A1:F1');
  const titleRow = worksheet.getRow(1);
  titleRow.height = 40;
  titleRow.getCell(1).font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
  titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // 3. Sección de Métricas Rápidas
  worksheet.insertRow(2, []); // Espacio
  const totalMonto = data.reduce((acc, curr) => acc + (curr.Monto || 0), 0);
  
  worksheet.insertRow(3, ['RESUMEN EJECUTIVO', '', '', 'FECHA DE REPORTE', new Date().toLocaleDateString()]);
  worksheet.mergeCells('A3:C3');
  worksheet.getRow(3).font = { bold: true };
  
  worksheet.insertRow(4, ['Flujo de Caja Total:', totalMonto, '', 'Estado de Portafolio:', 'Activo']);
  const metricsRow = worksheet.getRow(4);
  metricsRow.getCell(2).numFmt = '"$"#,##0';
  metricsRow.getCell(2).font = { bold: true, color: { argb: totalMonto >= 0 ? 'FF10B981' : 'FFEF4444' } };

  worksheet.insertRow(5, []); // Espacio

  // 4. Estilizar Encabezados de la Tabla
  const headerRow = worksheet.getRow(6);
  headerRow.values = columns.map(c => c.header);
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // 5. Agregar Datos con Estilo Alternado (Zebra)
  data.forEach((item, index) => {
    const row = worksheet.addRow(item);
    const isEven = index % 2 === 0;
    
    row.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFF8FAFC' : 'FFFFFFFF' }
      };
      cell.border = {
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };

      // Formatear columna de Monto
      if (columns[colNumber - 1].key === 'Monto') {
        cell.numFmt = '"$"#,##0';
        cell.font = { bold: true, color: { argb: cell.value && (cell.value as number) < 0 ? 'FFEF4444' : 'FF10B981' } };
      }
    });
  });

  // 6. Finalizar y Descargar
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
