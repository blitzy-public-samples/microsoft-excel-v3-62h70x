import mongoose from 'mongoose';
import { WorkbookDocument } from 'src/shared/types/index';
import { Worksheet } from 'src/backend/models/Worksheet';
import { User } from 'src/backend/models/User';

const WorkbookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worksheets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worksheet'
  }],
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

WorkbookSchema.methods.createWorksheet = async function(name: string): Promise<WorkbookDocument> {
  const worksheet = new Worksheet({ name, workbook: this._id });
  await worksheet.save();
  this.worksheets.push(worksheet._id);
  await this.save();
  return this;
};

WorkbookSchema.methods.removeWorksheet = async function(worksheetId: mongoose.Types.ObjectId): Promise<WorkbookDocument> {
  this.worksheets = this.worksheets.filter(id => !id.equals(worksheetId));
  await Worksheet.findByIdAndDelete(worksheetId);
  await this.save();
  return this;
};

WorkbookSchema.methods.shareWorkbook = async function(userId: mongoose.Types.ObjectId): Promise<WorkbookDocument> {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (!this.sharedWith.some(id => id.equals(userId))) {
    this.sharedWith.push(userId);
    await this.save();
  }
  return this;
};

WorkbookSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedBy = this.get('lastModifiedBy') || this.get('owner');
  }
  next();
});

WorkbookSchema.post('find', function(docs) {
  if (Array.isArray(docs)) {
    docs.forEach(doc => {
      doc.populate('owner').populate('worksheets');
    });
  }
});

export const Workbook = mongoose.model<WorkbookDocument>('Workbook', WorkbookSchema);