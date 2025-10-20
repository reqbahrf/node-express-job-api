import fs from 'fs/promises';
import path from 'path';

export const deleteFiles = async (filePaths: string[]): Promise<void> => {
  if (filePaths.length === 0) return;

  await Promise.all(
    filePaths.map(async (filePath) => {
      try {
        const fullPath = path.isAbsolute(filePath)
          ? filePath
          : path.join(process.cwd(), filePath);

        try {
          await fs.access(fullPath, fs.constants.F_OK);
          await fs.unlink(fullPath);
          console.log(`Successfully deleted file: ${fullPath}`);
        } catch (error) {
          console.error(`Failed to delete file ${fullPath}:`, error);
        }
      } catch (error) {
        console.error(`Error processing file path ${filePath}:`, error);
      }
    })
  );
};

export const cleanupOnError = async (
  filePaths: string[],
  error: Error
): Promise<never> => {
  if (filePaths.length > 0) {
    console.log('Cleaning up uploaded files due to error:', error.message);
    await deleteFiles(filePaths);
  }
  throw error;
};
