// Configure Gemini AI models
export const models = {
  default: "gemini-1.5-pro",
  creative: "gemini-1.5-pro", // With higher temperature
  precise: "gemini-1.5-pro", // With lower temperature
  flash: "gemini-1.5-flash", // Faster, more efficient model
}

// Helper function to get appropriate model configuration based on content type
export function getModelForContentType(contentType: string, tone: string) {
  if (tone === "creative" || tone === "humorous" || tone === "inspirational") {
    return {
      model: models.creative,
      temperature: 0.8,
    }
  }

  if (tone === "professional" || tone === "informative") {
    return {
      model: models.precise,
      temperature: 0.2,
    }
  }

  // Use flash for quick generations
  if (contentType === "tweet" || contentType === "story") {
    return {
      model: models.flash,
      temperature: 0.5,
    }
  }

  return {
    model: models.default,
    temperature: 0.5,
  }
}
