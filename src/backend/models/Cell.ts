import mongoose from 'mongoose';
import { CellDocument, CellValue, CellCoordinate } from 'src/shared/types/index';
import { Worksheet } from 'src/backend/models/Worksheet';

const CellSchema = new mongoose.Schema({
  worksheet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worksheet',
    required: true
  },
  coordinate: {
    row: {
      type: Number,
      required: true
    },
    column: {
      type: Number,
      required: true
    }
  },
  value: {
    type: mongoose.Schema.Types.Mixed
  },
  formula: {
    type: String,
    default: ''
  },
  format: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

// Pre-save hook to validate cell coordinate
CellSchema.pre('save', function(next) {
  const cell = this as CellDocument;
  if (cell.coordinate.row <= 0 || cell.coordinate.column <= 0) {
    return next(new Error('Cell coordinates must be positive integers'));
  }
  // TODO: Implement check for worksheet dimensions
  next();
});

// Post-save hook to update Worksheet's lastModifiedBy
CellSchema.post('save', async function(doc: CellDocument) {
  const worksheet = await Worksheet.findById(doc.worksheet);
  if (worksheet) {
    // TODO: Implement updating lastModifiedBy with current user
    await worksheet.save();
  }
});

CellSchema.methods.updateValue = async function(newValue: CellValue): Promise<CellDocument> {
  this.value = newValue;
  if (this.formula) {
    // TODO: Implement formula recalculation
  }
  // TODO: Implement finding and updating dependent cells
  await this.save();
  return this;
};

CellSchema.methods.updateFormula = async function(newFormula: string): Promise<CellDocument> {
  this.formula = newFormula;
  // TODO: Implement formula parsing and evaluation
  // TODO: Update this.value with the calculated result
  await this.save();
  return this;
};

CellSchema.methods.updateFormat = async function(newFormat: object): Promise<CellDocument> {
  this.format = { ...this.format, ...newFormat };
  await this.save();
  return this;
};

export const Cell = mongoose.model<CellDocument>('Cell', CellSchema);