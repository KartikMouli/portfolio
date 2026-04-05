import { z } from 'zod';
import type { FileUploadSettings } from '@/types/app';

/**
 * Validates a local file against Dify's AppParams constraints.
 */
export const validateFileUpload = (
  file: File,
  settings: FileUploadSettings,
  currentFilesCount: number
) => {
  const { allowed_file_extensions, number_limits, fileUploadConfig } = settings;
  const imageSizeLimit = fileUploadConfig?.image_file_size_limit || 10; // in MB
  const generalSizeLimit = fileUploadConfig?.file_size_limit || 15; // in MB

  // 1. Check quantity limit
  if (currentFilesCount >= number_limits) {
    return {
      success: false,
      error: `You can only upload up to ${number_limits} files.`,
    };
  }

  // 2. Check file size (in bytes, so MB * 1024 * 1024)
  const isImage = file.type.startsWith('image/');
  const sizeLimitMB = isImage ? imageSizeLimit : generalSizeLimit;
  if (file.size > sizeLimitMB * 1024 * 1024) {
    return {
      success: false,
      error: `File size exceeds the ${sizeLimitMB}MB limit.`,
    };
  }

  // 3. Check extension
  const fileExt = `.${file.name.split('.').pop()?.toUpperCase()}`;
  const allowedExts = allowed_file_extensions.map((ext) => ext.toUpperCase());
  if (allowed_file_extensions.length > 0 && !allowedExts.includes(fileExt)) {
    return {
      success: false,
      error: `Unsupported file extension. Allowed: ${allowed_file_extensions.join(', ')}`,
    };
  }

  return { success: true };
};

/**
 * Validates a remote URL string.
 */
export const validateRemoteUrl = (
  url: string,
  settings: FileUploadSettings,
  currentFilesCount: number
) => {
  const { number_limits, allowed_file_extensions } = settings;

  // 1. Check quantity limit
  if (currentFilesCount >= number_limits) {
    return {
      success: false,
      error: `You can only add up to ${number_limits} files.`,
    };
  }

  // 2. Validate URL format
  const urlSchema = z.string().url('Please enter a valid URL.');
  const urlResult = urlSchema.safeParse(url);
  if (!urlResult.success) {
    return { success: false, error: urlResult.error.issues[0].message };
  }

  // 3. Optional: check extension from URL path
  const urlPath = new URL(url).pathname;
  const urlExt = `.${urlPath.split('.').pop()?.toUpperCase()}`;
  const allowedExts = allowed_file_extensions.map((ext) => ext.toUpperCase());

  // Only check if extensions are specified and URL has an extension-like ending
  if (
    allowed_file_extensions.length > 0 &&
    urlExt.length > 1 &&
    urlExt.length < 6
  ) {
    if (!allowedExts.includes(urlExt)) {
      return {
        success: false,
        error: `URL does not seem to point to an allowed image type (${allowed_file_extensions.join(', ')})`,
      };
    }
  }

  return { success: true };
};
