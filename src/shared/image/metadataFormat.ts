/** Formats parsed metadata as indented JSON text. */
export function formatMetadataJson(metadata: unknown): string {
  return JSON.stringify(metadata ?? {}, null, 2);
}

/** Builds a status message after parsing file metadata. */
export function metadataStatusMessage(fileName: string, metadata: unknown): string {
  return metadata
    ? `Parsed metadata from ${fileName}`
    : `No embedded metadata found in ${fileName}`;
}
