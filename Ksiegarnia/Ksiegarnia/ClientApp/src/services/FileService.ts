class FileService {
  splitBase64(text?: string) {
    if (!text) {
      return text;
    }
    return text.split(",")[1];
  }
}

export default new FileService();
