import { Component, signal } from '@angular/core';
import { GuestsService } from '../../services/guests.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  exporting = signal(false);

  constructor(private guestsService: GuestsService) {}

  refresh(): void {
    window.location.reload();
  }

  exportGuests(): void {
    this.exporting.set(true);
    this.guestsService.getGuests().subscribe({
      next: async (guests) => {
        try {
          const excelModule: any = await import('exceljs');
          const ExcelJS = excelModule.Workbook ? excelModule : excelModule.default;
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet('Invitados');
          sheet.columns = [
            { header: 'Nombre', key: 'name', width: 20 },
            { header: 'Apellido', key: 'lastName', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Número', key: 'numberPhone', width: 18 },
            { header: 'Restricción', key: 'restriccion', width: 25 },
            { header: 'Confirmación', key: 'confirmation', width: 15 },
            { header: 'Fecha', key: 'createdAt', width: 14 },
            { header: 'Mensaje', key: 'message', width: 40 },
          ];
          sheet.getRow(1).font = { bold: true };
          guests.forEach((guest) =>
            sheet.addRow({
              ...guest,
              confirmation: guest.confirmation ? 'Confirmado' : 'Pendiente',
              createdAt: (guest.createdAt ?? '').slice(0, 10),
            })
          );

          const buffer = await workbook.xlsx.writeBuffer();
          const url = URL.createObjectURL(
            new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
          );
          const link = document.createElement('a');
          link.href = url;
          link.download = 'invitados.xlsx';
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error al generar el Excel', error);
          window.alert('No se pudo generar el Excel.');
        } finally {
          this.exporting.set(false);
        }
      },
      error: () => {
        this.exporting.set(false);
        window.alert('No se pudo generar el Excel.');
      },
    });
  }
}
