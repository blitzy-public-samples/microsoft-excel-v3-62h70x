import mongoose from 'mongoose';
import { ChartDocument, ChartType, CellRange } from 'src/shared/types/index';
import { Worksheet } from 'src/backend/models/Worksheet';

const ChartSchema = new mongoose.Schema({
  worksheet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worksheet',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["BAR", "LINE", "PIE", "SCATTER", "AREA", "COLUMN"],
    required: true
  },
  dataRange: {
    start: {
      row: { type: Number, required: true },
      column: { type: Number, required: true }
    },
    end: {
      row: { type: Number, required: true },
      column: { type: Number, required: true }
    }
  },
  options: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

// Pre-save hook to validate data range
ChartSchema.pre('save', async function(next) {
  const chart = this as ChartDocument;
  const { start, end } = chart.dataRange;

  // Check if the data range is valid (start <= end)
  if (start.row > end.row || start.column > end.column) {
    throw new Error('Invalid data range: start coordinates must be less than or equal to end coordinates');
  }

  // Ensure the data range is within the worksheet's dimensions
  const worksheet = await Worksheet.findById(chart.worksheet);
  if (!worksheet) {
    throw new Error('Associated worksheet not found');
  }

  if (end.row > worksheet.rowCount || end.column > worksheet.columnCount) {
    throw new Error('Data range exceeds worksheet dimensions');
  }

  next();
});

// Post-save hook to update Worksheet's lastModifiedBy
ChartSchema.post('save', async function(doc, next) {
  const chart = doc as ChartDocument;
  const worksheet = await Worksheet.findById(chart.worksheet);
  if (worksheet) {
    worksheet.lastModifiedBy = chart.lastModifiedBy; // Assuming lastModifiedBy is set on the chart
    await worksheet.save();
  }
  next();
});

ChartSchema.methods.updateChartType = async function(newType: ChartType): Promise<ChartDocument> {
  this.type = newType;
  return await this.save();
};

ChartSchema.methods.updateDataRange = async function(newRange: CellRange): Promise<ChartDocument> {
  const worksheet = await Worksheet.findById(this.worksheet);
  if (!worksheet) {
    throw new Error('Associated worksheet not found');
  }

  if (newRange.end.row > worksheet.rowCount || newRange.end.column > worksheet.columnCount) {
    throw new Error('New data range exceeds worksheet dimensions');
  }

  this.dataRange = newRange;
  return await this.save();
};

ChartSchema.methods.updateOptions = async function(newOptions: object): Promise<ChartDocument> {
  this.options = { ...this.options, ...newOptions };
  return await this.save();
};

export const Chart = mongoose.model<ChartDocument>('Chart', ChartSchema);