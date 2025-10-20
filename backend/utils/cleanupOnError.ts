import fs from 'fs/promises';
import path from 'path';
import File from '../models/File.js';

export const cleanupOnError = async (
  filePaths: string[] = [],
  fileIds: string[] = [],
  error: Error
): Promise<never> => {
  try {
    if (filePaths.length > 0) {
      await Promise.all(
        filePaths.map(async (filePath) => {
          try {
            const fullPath = path.isAbsolute(filePath)
              ? filePath
              : path.join(process.cwd(), filePath);

            await fs.access(fullPath, fs.constants.F_OK);
            await fs.unlink(fullPath);
          } catch (err) {
            console.error(`Failed to delete file ${filePath}:`, err);
          }
        })
      );
    }

    if (fileIds.length > 0) {
      try {
        const result = await File.deleteMany({ _id: { $in: fileIds } });
        console.log(`Cleaned up ${result.deletedCount} file documents`);
      } catch (err) {
        console.error('Failed to clean up file documents:', err);
      }
    }
  } catch (err) {
    console.error('Error during cleanup:', err);
  }

  // Always re-throw the original error
  throw error;
};
