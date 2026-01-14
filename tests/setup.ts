// Test setup: console çıktılarını ve stdout'u temizle
const originalError = console.error;
const originalStdoutWrite = process.stdout.write;

beforeAll(() => {
  // Verbose testlerde console.error'u bastır
  console.error = jest.fn();
  
  // Terminal bell karakterini (\a) stdout'a yazmayı engelle
  // Bu sayede test çıktısında "a" harfleri görünmez
  process.stdout.write = jest.fn((chunk: any, encoding?: any, cb?: any) => {
    // Bell karakterini (\a) filtrele
    if (typeof chunk === 'string' && chunk === '\a') {
      return true;
    }
    // Diğer yazıları normal şekilde işle (eğer gerekirse)
    return true;
  }) as any;
});

afterAll(() => {
  // Orijinal fonksiyonları geri yükle
  console.error = originalError;
  process.stdout.write = originalStdoutWrite;
});
