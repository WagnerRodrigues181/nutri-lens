import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  exportToCSV,
  exportToJSON,
  exportWeeklyReport,
} from "@/services/export";
import { mockNutritionHistory, mockGoals } from "../mockData";

describe("export service", () => {
  let createElementSpy: any;
  let createObjectURLSpy: any;
  let revokeObjectURLSpy: any;
  let mockLink: any;

  beforeEach(() => {
    mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
      setAttribute: vi.fn(),
    };

    createElementSpy = vi
      .spyOn(document, "createElement")
      .mockReturnValue(mockLink as any);

    vi.spyOn(document.body, "appendChild").mockImplementation(() => mockLink);
    vi.spyOn(document.body, "removeChild").mockImplementation(() => mockLink);

    createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:mock-url");
    revokeObjectURLSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("exportToCSV", () => {
    it("should create download link for CSV export", () => {
      exportToCSV(mockNutritionHistory, "pt-BR");

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(mockLink.href).toBe("blob:mock-url");
      expect(mockLink.download).toBe("nutrilens-data.csv");
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
    });

    it("should format CSV with proper headers in pt-BR", () => {
      let capturedBlob: Blob | null = null;

      createObjectURLSpy.mockImplementation((blob: Blob) => {
        capturedBlob = blob;
        return "blob:mock-url";
      });

      exportToCSV(mockNutritionHistory, "pt-BR");

      expect(capturedBlob).not.toBeNull();
      expect((capturedBlob as unknown as Blob).type).toBe("text/csv");

      const reader = new FileReader();
      reader.onload = () => {
        const csvContent = reader.result as string;
        expect(csvContent).toContain("Data");
        expect(csvContent).toContain("Calorias");
        expect(csvContent).toContain("Proteína");
      };
      if (capturedBlob) reader.readAsText(capturedBlob);
    });

    it("should format CSV with proper headers in en-US", () => {
      let capturedBlob: Blob | null = null;

      createObjectURLSpy.mockImplementation((blob: Blob) => {
        capturedBlob = blob;
        return "blob:mock-url";
      });

      exportToCSV(mockNutritionHistory, "en-US");

      expect(capturedBlob).not.toBeNull();
      expect((capturedBlob as unknown as Blob).type).toBe("text/csv");

      const reader = new FileReader();
      reader.onload = () => {
        const csvContent = reader.result as string;
        expect(csvContent).toContain("Date");
        expect(csvContent).toContain("Calories");
        expect(csvContent).toContain("Protein");
      };
      if (capturedBlob) reader.readAsText(capturedBlob);
    });
  });

  describe("exportToJSON", () => {
    it("should create download link for JSON export", () => {
      exportToJSON(mockNutritionHistory, mockGoals);

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(mockLink.href).toBe("blob:mock-url");
      expect(mockLink.download).toBe("nutrilens-backup.json");
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
    });

    it("should include export date, goals and history in JSON", () => {
      let capturedBlob: Blob | null = null;

      createObjectURLSpy.mockImplementation((blob: Blob) => {
        capturedBlob = blob;
        return "blob:mock-url";
      });

      exportToJSON(mockNutritionHistory, mockGoals);

      expect(capturedBlob).not.toBeNull();
      expect((capturedBlob as unknown as Blob).type).toBe("application/json");

      const reader = new FileReader();
      reader.onload = () => {
        const jsonContent = JSON.parse(reader.result as string);
        expect(jsonContent).toHaveProperty("exportDate");
        expect(jsonContent).toHaveProperty("goals");
        expect(jsonContent).toHaveProperty("history");
        expect(jsonContent.goals).toEqual(mockGoals);
        expect(jsonContent.history).toEqual(mockNutritionHistory);
      };
      if (capturedBlob) reader.readAsText(capturedBlob);
    });
  });

  describe("exportWeeklyReport", () => {
    it("should create download link for weekly report in pt-BR", () => {
      exportWeeklyReport(
        mockNutritionHistory,
        "2024-01-14",
        "2024-01-15",
        "pt-BR"
      );

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(mockLink.href).toBe("blob:mock-url");
      expect(mockLink.download).toBe("nutrilens-weekly-report.csv");
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
    });

    it("should create download link for weekly report in en-US", () => {
      exportWeeklyReport(
        mockNutritionHistory,
        "2024-01-14",
        "2024-01-15",
        "en-US"
      );

      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(mockLink.download).toBe("nutrilens-weekly-report.csv");
      expect(mockLink.click).toHaveBeenCalled();
    });

    it("should return error when no data found for period", () => {
      const result = exportWeeklyReport(
        mockNutritionHistory,
        "2025-12-01",
        "2025-12-07",
        "pt-BR"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Nenhum dado encontrado para o período selecionado"
      );
      expect(mockLink.click).not.toHaveBeenCalled();
    });

    it("should return error in en-US when no data found", () => {
      const result = exportWeeklyReport(
        mockNutritionHistory,
        "2025-12-01",
        "2025-12-07",
        "en-US"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("No data found for the selected period");
      expect(mockLink.click).not.toHaveBeenCalled();
    });

    it("should format CSV with proper headers and averages in pt-BR", () => {
      let capturedBlob: Blob | null = null;

      createObjectURLSpy.mockImplementation((blob: Blob) => {
        capturedBlob = blob;
        return "blob:mock-url";
      });

      exportWeeklyReport(
        mockNutritionHistory,
        "2024-01-14",
        "2024-01-15",
        "pt-BR"
      );

      expect(capturedBlob).not.toBeNull();
      expect((capturedBlob as unknown as Blob).type).toBe("text/csv");

      const reader = new FileReader();
      reader.onload = () => {
        const csvContent = reader.result as string;
        expect(csvContent).toContain("Data");
        expect(csvContent).toContain("Dia");
        expect(csvContent).toContain("MÉDIAS");
        expect(csvContent).toContain("Média Semanal");
      };
      if (capturedBlob) reader.readAsText(capturedBlob);
    });

    it("should format CSV with proper headers and averages in en-US", () => {
      let capturedBlob: Blob | null = null;

      createObjectURLSpy.mockImplementation((blob: Blob) => {
        capturedBlob = blob;
        return "blob:mock-url";
      });

      exportWeeklyReport(
        mockNutritionHistory,
        "2024-01-14",
        "2024-01-15",
        "en-US"
      );

      expect(capturedBlob).not.toBeNull();

      const reader = new FileReader();
      reader.onload = () => {
        const csvContent = reader.result as string;
        expect(csvContent).toContain("Date");
        expect(csvContent).toContain("Day");
        expect(csvContent).toContain("AVERAGES");
        expect(csvContent).toContain("Weekly Average");
      };
      if (capturedBlob) reader.readAsText(capturedBlob);
    });
  });
});
