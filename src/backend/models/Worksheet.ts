import mongoose from 'mongoose';
import { WorksheetDocument } from 'src/shared/types/index';
import { Cell } from 'src/backend/models/Cell';
import { Chart } from 'src/backend/models/Chart';
import { Workbook } from 'src/backend/models/Workbook';

const WorksheetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  workbook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workbook',
    required: true
  },
  cells: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cell'
  }],
  charts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chart'
  }],
  rowCount: {
    type: Number,
    default: 1000
  },
  columnCount: {
    type: Number,
    default: 26
  }
}, { timestamps: true });

WorksheetSchema.methods.createCell = async function(cellData: any): Promise<WorksheetDocument> {
  const cell = await Cell.create(cellData);
  this.cells.push(cell._id);
  await this.save();
  return this;
};

WorksheetSchema.methods.updateCell = async function(cellId: mongoose.Types.ObjectId, cellData: any): Promise<WorksheetDocument> {
  await Cell.findByIdAndUpdate(cellId, cellData);
  return this;
};

WorksheetSchema.methods.deleteCell = async function(cellId: mongoose.Types.ObjectId): Promise<WorksheetDocument> {
  this.cells = this.cells.filter(id => !id.equals(cellId));
  await Cell.findByIdAndDelete(cellId);
  await this.save();
  return this;
};

WorksheetSchema.methods.addChart = async function(chartData: any): Promise<WorksheetDocument> {
  const chart = await Chart.create(chartData);
  this.charts.push(chart._id);
  await this.save();
  return this;
};

WorksheetSchema.methods.removeChart = async function(chartId: mongoose.Types.ObjectId): Promise<WorksheetDocument> {
  this.charts = this.charts.filter(id => !id.equals(chartId));
  await Chart.findByIdAndDelete(chartId);
  await this.save();
  return this;
};

WorksheetSchema.pre('save', async function(next) {
  if (this.isModified() && !this.isNew) {
    const workbook = await Workbook.findById(this.workbook);
    if (workbook) {
      workbook.lastModifiedBy = this.lastModifiedBy;
      await workbook.save();
    }
  }
  next();
});

WorksheetSchema.post('find', function(docs) {
  if (Array.isArray(docs)) {
    docs.forEach(doc => {
      doc.populate('cells').populate('charts');
    });
  } else if (docs) {
    docs.populate('cells').populate('charts');
  }
});

export const Worksheet = mongoose.model<WorksheetDocument>('Worksheet', WorksheetSchema);