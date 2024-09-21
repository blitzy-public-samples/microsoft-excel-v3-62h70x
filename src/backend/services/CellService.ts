import { Cell } from 'src/backend/models/Cell';
import { Worksheet } from 'src/backend/models/Worksheet';
import { CellDocument, CellCoordinate, CellValue, Formula } from 'src/shared/types/index';
import { evaluateFormula } from 'src/shared/utils/index';

export class CellService {
  constructor() {}

  async getCell(worksheetId: string, coordinate: CellCoordinate): Promise<CellDocument | null> {
    try {
      const cell = await Cell.findOne({ worksheetId, coordinate });
      return cell;
    } catch (error) {
      console.error('Error retrieving cell:', error);
      throw error;
    }
  }

  async createOrUpdateCell(
    worksheetId: string,
    coordinate: CellCoordinate,
    value: CellValue,
    formula: Formula,
    format: object
  ): Promise<CellDocument> {
    try {
      let cell = await Cell.findOne({ worksheetId, coordinate });

      if (!cell) {
        cell = new Cell({ worksheetId, coordinate });
      }

      cell.value = value;
      cell.formula = formula;
      cell.format = format;

      if (formula) {
        cell.value = await evaluateFormula(formula, worksheetId);
      }

      await cell.save();

      if (!cell._id) {
        await Worksheet.findByIdAndUpdate(worksheetId, { $push: { cells: cell._id } });
      }

      return cell;
    } catch (error) {
      console.error('Error creating or updating cell:', error);
      throw error;
    }
  }

  async deleteCell(worksheetId: string, coordinate: CellCoordinate): Promise<void> {
    try {
      const cell = await Cell.findOne({ worksheetId, coordinate });

      if (!cell) {
        throw new Error('Cell not found');
      }

      await Worksheet.findByIdAndUpdate(worksheetId, { $pull: { cells: cell._id } });
      await Cell.findByIdAndDelete(cell._id);
    } catch (error) {
      console.error('Error deleting cell:', error);
      throw error;
    }
  }

  async updateCellFormat(
    worksheetId: string,
    coordinate: CellCoordinate,
    format: object
  ): Promise<CellDocument> {
    try {
      const cell = await Cell.findOne({ worksheetId, coordinate });

      if (!cell) {
        throw new Error('Cell not found');
      }

      cell.format = { ...cell.format, ...format };
      await cell.save();

      return cell;
    } catch (error) {
      console.error('Error updating cell format:', error);
      throw error;
    }
  }

  async getCellsInRange(
    worksheetId: string,
    startCoordinate: CellCoordinate,
    endCoordinate: CellCoordinate
  ): Promise<CellDocument[]> {
    try {
      const cells = await Cell.find({
        worksheetId,
        'coordinate.row': { $gte: startCoordinate.row, $lte: endCoordinate.row },
        'coordinate.column': { $gte: startCoordinate.column, $lte: endCoordinate.column },
      });

      return cells;
    } catch (error) {
      console.error('Error retrieving cells in range:', error);
      throw error;
    }
  }
}