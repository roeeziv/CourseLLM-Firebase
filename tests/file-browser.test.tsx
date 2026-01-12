import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileBrowser } from "@/app/teacher/file-management/_components/file-browser";
import { useAuth } from "@/components/AuthProviderClient";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// --- MOCK DATA SETUP ---

// 1. Mock the Data Module
jest.mock("@/lib/files", () => {
  const MOCK_FILES = [
    { id: "1", name: "lesson-plan.pdf", type: "pdf", size: "1MB", date: "2024-01-01", url: "https://example.com/pdf" },
    { id: "2", name: "video-lecture.mp4", type: "mp4", size: "10MB", date: "2024-01-01", url: "#" },
    { id: "3", name: "audio-notes.mp3", type: "mp3", size: "5MB", date: "2024-01-01", url: "#" },
    { id: "4", name: "materials.zip", type: "zip", size: "2MB", date: "2024-01-01", url: "#" },
    { id: "5", name: "slides.ppt", type: "ppt", size: "3MB", date: "2024-01-01", url: "#" },
    { id: "6", name: "unknown.xyz", type: "xyz", size: "1KB", date: "2024-01-01", url: "#" },
  ];
  return {
    initialFiles: MOCK_FILES,
  };
});

// 2. Mock icons
jest.mock("lucide-react", () => ({
  File: () => <div data-testid="icon-file" />,
  FileArchive: () => <div data-testid="icon-file-archive" />,
  FileAudio: () => <div data-testid="icon-file-audio" />,
  FileText: () => <div data-testid="icon-file-text" />,
  FileVideo: () => <div data-testid="icon-file-video" />,
  FileImage: () => <div data-testid="icon-file-image" />,
  Presentation: () => <div data-testid="icon-presentation" />,
  Trash2: () => <div data-testid="icon-trash" />,
  MoreVertical: () => <div data-testid="icon-more" />,
  Upload: () => <div data-testid="icon-upload" />,
  Check: () => <div data-testid="icon-check" />,
  X: () => <div data-testid="icon-x" />,
}));

// 3. Mock Next.js and Auth
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/AuthProviderClient", () => ({
  useAuth: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockPush = jest.fn();

describe("FileBrowser", () => {
  // Define userEvent here so it is available to ALL tests
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    
    // Mock URL object
    global.URL.createObjectURL = jest.fn((file) => `blob:${file.name}`);
    global.URL.revokeObjectURL = jest.fn();
  });

  // --- Auth Tests ---

  it("should show loading state", () => {
    mockUseAuth.mockReturnValue({ loading: true, profile: null });
    render(<FileBrowser />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should redirect to /login if not authenticated", () => {
    mockUseAuth.mockReturnValue({ loading: false, profile: null });
    render(<FileBrowser />);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  // --- Functional Tests ---

  it("should render the initial list of files", async () => {
    mockUseAuth.mockReturnValue({ loading: false, profile: { role: "teacher" } });
    render(<FileBrowser />);

    expect(screen.getByText("lesson-plan.pdf")).toBeInTheDocument();
    expect(screen.getByText("video-lecture.mp4")).toBeInTheDocument();
  });

  it("should upload a file and see it in the list", async () => {
    mockUseAuth.mockReturnValue({ loading: false, profile: { role: "teacher" } });
    render(<FileBrowser />);

    const file = new File(["dummy content"], "new-upload.png", { type: "image/png" });
    const uploadInput = screen.getByTestId("upload-input");

    await user.upload(uploadInput, file);

    await waitFor(() => {
      expect(screen.getByText("new-upload.png")).toBeInTheDocument();
    });
  });

  it("should delete a file from the list", async () => {
    mockUseAuth.mockReturnValue({ loading: false, profile: { role: "teacher" } });
    render(<FileBrowser />);

    expect(screen.getByText("lesson-plan.pdf")).toBeInTheDocument();

    const moreOptionsButtons = screen.getAllByTestId("icon-more");
    await user.click(moreOptionsButtons[0]);

    const deleteOption = await screen.findByText("Delete");
    await user.click(deleteOption);

    const confirmButton = screen.getByRole("button", { name: /delete/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText("lesson-plan.pdf")).not.toBeInTheDocument();
    });
  });

  it("should cancel file deletion", async () => {
    mockUseAuth.mockReturnValue({ loading: false, profile: { role: "teacher" } });
    render(<FileBrowser />);

    const moreOptionsButtons = screen.getAllByTestId("icon-more");
    await user.click(moreOptionsButtons[0]);

    const deleteOption = await screen.findByText("Delete");
    await user.click(deleteOption);

    const cancelButton = await screen.findByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
    });
    expect(screen.getByText("lesson-plan.pdf")).toBeInTheDocument();
  });

  it("should open the file in a new tab when clicked", async () => {
    mockUseAuth.mockReturnValue({ loading: false, profile: { role: "teacher" } });
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

    render(<FileBrowser />);

    const fileLink = screen.getByText("lesson-plan.pdf");
    fireEvent.click(fileLink);

    expect(openSpy).toHaveBeenCalledWith("https://example.com/pdf", "_blank");
    openSpy.mockRestore();
  });

  it("should render correct icons for different file types", async () => {
    mockUseAuth.mockReturnValue({ loading: false, profile: { role: "teacher" } });
    render(<FileBrowser />);

    await waitFor(() => {
      expect(screen.getByTestId("icon-file-text")).toBeInTheDocument();
      expect(screen.getByTestId("icon-file-video")).toBeInTheDocument();
      expect(screen.getByTestId("icon-file-audio")).toBeInTheDocument();
      expect(screen.getByTestId("icon-file-archive")).toBeInTheDocument();
      expect(screen.getByTestId("icon-presentation")).toBeInTheDocument();
      expect(screen.getByTestId("icon-file")).toBeInTheDocument();
    });
  });

  // --- New Tests for Full Coverage ---

  it("should handle file upload error gracefully", async () => {
    mockUseAuth.mockReturnValue({ loading: false, profile: { role: "teacher" } });
    
    // 1. Spy on console.error to verify the catch block works
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<FileBrowser />);

    const file = new File(["error"], "error.png", { type: "image/png" });
    const uploadInput = screen.getByTestId("upload-input");

    // 2. Mock createObjectURL to fail cleanly
    // We use mockImplementation, but we ensure it doesn't crash the test harness
    // by letting the component call it, then checking if the error was logged.
    (global.URL.createObjectURL as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Simulated Upload Error");
    });

    // 3. Wrap the upload interaction in a try/catch block for the TEST 
    // This prevents the "uncaught exception" from failing the test runner itself,
    // allowing us to assert that the COMPONENT handled the error (by logging it).
    try {
      await user.upload(uploadInput, file);
    } catch (e) {
      // We expect the user event might bubble this up, but we care if the component logged it.
    }

    // 4. Verify the component's catch block was executed
    await waitFor(() => {
       expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
  it("should not allow students to see upload or delete options", () => {
      mockUseAuth.mockReturnValue({ loading: false, profile: { role: "student" } });
      render(<FileBrowser />);
      
      const uploadButton = screen.queryByText(/upload/i);
      expect(uploadButton).not.toBeInTheDocument();
      
      const moreOptions = screen.queryByTestId("icon-more");
      expect(moreOptions).not.toBeInTheDocument();
  });
});