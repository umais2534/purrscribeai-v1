import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TranscriptionHistory from "./TranscriptionHistory";

// Mock the callService
jest.mock("../../services/callService", () => ({
  getCallRecordings: jest.fn().mockResolvedValue([
    {
      id: "call-1",
      petId: "pet-1",
      petName: "Max",
      ownerName: "John Smith",
      duration: 120,
      date: new Date("2023-06-20"),
      audioUrl: "blob:mock-audio-url",
      transcription:
        "Veterinarian: Hello, this is Dr. Smith calling about Max...",
      summary: "Follow-up on recent treatment plan. Pet is responding well.",
    },
    {
      id: "call-2",
      petId: "pet-2",
      petName: "Bella",
      ownerName: "Sarah Johnson",
      duration: 90,
      date: new Date("2023-06-18"),
      audioUrl: "blob:mock-audio-url-2",
    },
  ]),
  transcribeCallRecording: jest.fn().mockResolvedValue({
    id: "call-2",
    petId: "pet-2",
    petName: "Bella",
    ownerName: "Sarah Johnson",
    duration: 90,
    date: new Date("2023-06-18"),
    audioUrl: "blob:mock-audio-url-2",
    transcription: "Newly transcribed content",
  }),
  summarizeTranscription: jest.fn().mockResolvedValue({
    id: "call-2",
    petId: "pet-2",
    petName: "Bella",
    ownerName: "Sarah Johnson",
    duration: 90,
    date: new Date("2023-06-18"),
    audioUrl: "blob:mock-audio-url-2",
    transcription: "Newly transcribed content",
    summary: "New summary content",
  }),
}));

// Mock Audio API
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe("TranscriptionHistory Component", () => {
  test("renders transcription list correctly", async () => {
    render(<TranscriptionHistory />);

    // Wait for the component to load call recordings
    await waitFor(() => {
      // Check if the component title is rendered
      expect(screen.getByText("Transcription History")).toBeInTheDocument();

      // Check if mock transcriptions are rendered
      expect(screen.getByText("Max - Annual Checkup")).toBeInTheDocument();
      expect(screen.getByText("Bella - Vaccination")).toBeInTheDocument();

      // Check if call recordings are rendered
      expect(screen.getByText("Max - Owner Call")).toBeInTheDocument();
      expect(screen.getByText("Bella - Owner Call")).toBeInTheDocument();
    });
  });

  test("filters transcriptions by format", async () => {
    render(<TranscriptionHistory />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText("Transcription History")).toBeInTheDocument();
    });

    // Click on the SOAP filter
    const soapTab = screen.getByText("SOAP");
    fireEvent.click(soapTab);

    // Check if only SOAP transcriptions are displayed
    expect(screen.getByText("Max - Annual Checkup")).toBeInTheDocument();
    expect(screen.getByText("Luna - Post-Surgery Checkup")).toBeInTheDocument();
    expect(screen.queryByText("Bella - Vaccination")).not.toBeInTheDocument();
  });

  test("searches transcriptions by query", async () => {
    render(<TranscriptionHistory />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText("Transcription History")).toBeInTheDocument();
    });

    // Enter search query
    const searchInput = screen.getByPlaceholderText("Search transcriptions...");
    fireEvent.change(searchInput, { target: { value: "dental" } });

    // Check if only matching transcriptions are displayed
    expect(screen.getByText("Cooper - Dental Cleaning")).toBeInTheDocument();
    expect(screen.queryByText("Max - Annual Checkup")).not.toBeInTheDocument();
  });

  test("opens transcription details when clicking on a transcription", async () => {
    render(<TranscriptionHistory />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText("Transcription History")).toBeInTheDocument();
    });

    // Click on a transcription
    const transcription = screen.getByText("Max - Annual Checkup");
    fireEvent.click(transcription);

    // Check if the details dialog is open
    await waitFor(() => {
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
      expect(screen.getByText("Share")).toBeInTheDocument();
      expect(screen.getByText("Print")).toBeInTheDocument();
    });
  });

  test("transcribes a call recording", async () => {
    render(<TranscriptionHistory />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText("Transcription History")).toBeInTheDocument();
    });

    // Click on a call recording without transcription
    const callRecording = screen.getAllByText("Bella - Owner Call")[0];
    fireEvent.click(callRecording);

    // Check if the details dialog is open and has a Transcribe button
    await waitFor(() => {
      const transcribeButton = screen.getByText("Transcribe");
      expect(transcribeButton).toBeInTheDocument();

      // Click the Transcribe button
      fireEvent.click(transcribeButton);
    });

    // Check if transcription was successful
    await waitFor(() => {
      expect(screen.getByText("Newly transcribed content")).toBeInTheDocument();
    });
  });

  test("summarizes a transcription", async () => {
    render(<TranscriptionHistory />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText("Transcription History")).toBeInTheDocument();
    });

    // Click on a call recording with transcription but no summary
    const callRecording = screen.getAllByText("Bella - Owner Call")[0];
    fireEvent.click(callRecording);

    // First transcribe it
    await waitFor(() => {
      const transcribeButton = screen.getByText("Transcribe");
      fireEvent.click(transcribeButton);
    });

    // Then summarize it
    await waitFor(() => {
      const summarizeButton = screen.getByText("Summarize");
      expect(summarizeButton).toBeInTheDocument();
      fireEvent.click(summarizeButton);
    });

    // Check if summarization was successful
    await waitFor(() => {
      expect(screen.getByText("New summary content")).toBeInTheDocument();
    });
  });
});
