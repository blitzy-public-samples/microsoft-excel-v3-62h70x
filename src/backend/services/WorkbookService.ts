import { Workbook } from '../models/Workbook';
import { Worksheet } from '../models/Worksheet';
import { User } from '../models/User';
import { WorkbookDocument, WorksheetDocument, UserDocument } from '../../shared/types/index';

export class WorkbookService {
  constructor() {}

  async createWorkbook(name: string, owner: UserDocument): Promise<WorkbookDocument> {
    const workbook = new Workbook({ name, owner: owner._id });
    const defaultWorksheet = new Worksheet({ name: 'Sheet1', workbook: workbook._id });
    
    workbook.worksheets.push(defaultWorksheet._id);
    
    await defaultWorksheet.save();
    await workbook.save();
    
    return workbook;
  }

  async getWorkbook(workbookId: string): Promise<WorkbookDocument> {
    const workbook = await Workbook.findById(workbookId);
    if (!workbook) {
      throw new Error('Workbook not found');
    }
    return workbook;
  }

  async updateWorkbook(workbookId: string, updateData: Partial<WorkbookDocument>): Promise<WorkbookDocument> {
    const workbook = await Workbook.findByIdAndUpdate(workbookId, updateData, { new: true });
    if (!workbook) {
      throw new Error('Workbook not found');
    }
    return workbook;
  }

  async deleteWorkbook(workbookId: string): Promise<void> {
    const workbook = await Workbook.findById(workbookId);
    if (!workbook) {
      throw new Error('Workbook not found');
    }
    
    await Worksheet.deleteMany({ _id: { $in: workbook.worksheets } });
    await Workbook.findByIdAndDelete(workbookId);
  }

  async addWorksheet(workbookId: string, worksheetName: string): Promise<WorksheetDocument> {
    const workbook = await Workbook.findById(workbookId);
    if (!workbook) {
      throw new Error('Workbook not found');
    }
    
    const newWorksheet = new Worksheet({ name: worksheetName, workbook: workbook._id });
    workbook.worksheets.push(newWorksheet._id);
    
    await newWorksheet.save();
    await workbook.save();
    
    return newWorksheet;
  }

  async removeWorksheet(workbookId: string, worksheetId: string): Promise<WorkbookDocument> {
    const workbook = await Workbook.findById(workbookId);
    if (!workbook) {
      throw new Error('Workbook not found');
    }
    
    workbook.worksheets = workbook.worksheets.filter(id => id.toString() !== worksheetId);
    await Worksheet.findByIdAndDelete(worksheetId);
    
    await workbook.save();
    return workbook;
  }

  async shareWorkbook(workbookId: string, userId: string, permission: string): Promise<WorkbookDocument> {
    const workbook = await Workbook.findById(workbookId);
    if (!workbook) {
      throw new Error('Workbook not found');
    }
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const sharedUserIndex = workbook.sharedWith.findIndex(share => share.user.toString() === userId);
    if (sharedUserIndex !== -1) {
      workbook.sharedWith[sharedUserIndex].permission = permission;
    } else {
      workbook.sharedWith.push({ user: user._id, permission });
    }
    
    await workbook.save();
    return workbook;
  }
}