# Content → Image Pipeline Visualizer

## Overview

A comprehensive debug dashboard that visualizes the complete end-to-end process of transforming blog content into AI-generated images.

## Access

**URL**: http://localhost:5000/debug/content-to-image-pipeline

## Complete Pipeline Flow

### 1. **Content Selection**
- Select any blog post from your MDX content directory
- Dropdown populated from `/content/blog/*.mdx` files
- Shows title, description, and category

### 2. **Content Analysis** (Stage 1)
- Parses MDX frontmatter and body content
- Extracts H2 and H3 section headings
- Identifies sections without existing images
- Captures surrounding context (preceding/following content)
- **Output**: List of sections needing images with full context

### 3. **Intent Generation** (Stage 2)
- For each section, generates detailed image intent
- Combines:
  - Section title and content
  - Blog title and description (overall context)
  - Preceding/following text for continuity
  - Use case (blog-header)
  - Style preference (photorealistic)
  - Aspect ratio (16:9)
- **Output**: Natural language intent describing desired image

**Example Intent**:
```
Professional blog header image for section titled "Step-by-Step Process".

Blog context: How to Create 30 Days of Social Media Content in 30 Minutes - Use AI to generate a month of social content in 30 minutes vs 4 hours manually.

Section content summary:
[First 500 chars of section content]

Previous context: [200 chars from preceding section]

Style: Photorealistic, professional, modern, magazine-quality
Purpose: Blog section header that visually represents the content
Aspect ratio: 16:9 (blog header format)
```

### 4. **Prompt Enhancement** (Stage 3) - Gemini 2.5 Flash
- Uses PromptEnhancementAgent with LLM-guided refinement
- **Iteration Process** (2-4 rounds):
  1. **Attribute Extraction**: Gemini analyzes intent and extracts visual attributes (composition, lighting, technical specs, colors, mood)
  2. **Initial Prompt Generation**: Creates optimized prompt with Nano Banana format
  3. **Self-Critique**: LLM evaluates quality and suggests improvements
  4. **Refinement**: Generates improved prompt based on feedback
  5. **Early Stopping**: Exits at 90%+ confidence or after max iterations
- **Output**: Final optimized prompt (typically 1,400+ characters)

**Enhancement Details Captured**:
- Each iteration's prompt text
- Confidence score (0-100%)
- LLM reasoning for changes
- Expected issues and mitigations
- Technical details:
  - Composition strategy
  - Lighting setup
  - Camera settings (specific models, lenses, ISO)
  - Color palette

### 5. **Image Generation** (Stage 4) - Nano Banana
- Sends final optimized prompt to Gemini Nano Banana
- Uses ImageGenerationAgent (without LLM enhancement flag, since already enhanced)
- Includes comprehensive negative prompt to avoid artifacts
- **Output**: Final generated image URL

### 6. **Results Visualization**
Comprehensive UI showing:
- **Summary Stats**: Blog post title, # images generated, total processing time
- **Per-Image Pipeline**: Visual flow diagram with status indicators
- **5 Tabbed Views** per image:
  1. **Content**: Original section text and analysis data
  2. **Intent**: Generated intent (input to enhancement)
  3. **Enhancement**: Full iteration history with Gemini 2.5 Flash reasoning
  4. **Generation**: Nano Banana processing details
  5. **Result**: Final image with before/after comparison (intent length vs enhanced prompt length)

## Architecture

### Files Created

#### Frontend
- `/app/debug/content-to-image-pipeline/page.tsx` (20KB)
  - Interactive UI with blog post selector
  - Pipeline visualization with stage indicators
  - Tabbed interface for detailed data inspection
  - Real-time progress tracking

#### Backend APIs
- `/app/api/debug/list-content/route.ts` (0.5KB)
  - Lists all available MDX blog posts
  - Returns: slug, title, description, category

- `/app/api/debug/content-to-image-pipeline/route.ts` (5KB)
  - Main pipeline orchestration endpoint
  - Processes blog post through all 4 stages
  - Returns complete traceability data

#### Content Analysis
- `/lib/agents/content-analyzer.ts` (5KB)
  - MDX frontmatter parser
  - Section extraction with heading detection
  - Context capture (preceding/following content)
  - Intent generation from section context

## UI Design Philosophy

### Visual Pipeline Flow
```
[📄 Content Analysis] → [🎯 Intent Generation] → [✨ Prompt Enhancement] → [🖼️ Image Generation]
```

Each stage shows:
- **Status**: Pending (○), Processing (⟳), Completed (✓), Error (✗)
- **Color coding**: Gray → Blue (processing) → Green (success) → Red (error)
- **Processing time**: Displayed below each stage
- **Animated pulse**: During active processing

### Tabbed Data View
Prevents information overload by organizing data into logical sections:
- **Content**: What we're analyzing
- **Intent**: What we want to create
- **Enhancement**: How we optimized the prompt
- **Generation**: How we created the image
- **Result**: What we produced

### Color System
- **Blue**: Content analysis, general information
- **Purple**: Prompt enhancement (Gemini 2.5 Flash)
- **Green**: Success states, final images
- **Orange**: Warnings, expected issues
- **Red**: Errors, problematic elements

## Example Workflow

1. **User Action**: Selects "How to Create 30 Days of Social Media Content in 30 Minutes"
2. **System Response**:
   - Parses MDX file
   - Finds 8 sections (H2/H3 headings)
   - Identifies 5 sections without images
   - Processes first 3 (demo limit)
3. **For each section**:
   - Extracts "Step-by-Step Process" heading and ~500 chars content
   - Generates intent: "Professional blog header for Step-by-Step Process..."
   - Gemini 2.5 Flash refines in 2 iterations (90% confidence)
   - Nano Banana generates image from 1,400-char optimized prompt
4. **Result**: 3 images in ~60-90 seconds with complete audit trail

## Performance

**Typical Processing Time** (per image):
- Content Analysis: < 1s
- Intent Generation: < 1s
- Prompt Enhancement: 10-15s (Gemini 2.5 Flash, 2-3 iterations)
- Image Generation: 8-12s (Nano Banana)
- **Total**: ~20-30s per image

**Batch Processing**: 3 images = ~60-90s total

## Cost Analysis

**Per Image**:
- Gemini 2.5 Flash (prompt enhancement): ~$0.02
- Gemini Nano Banana (image generation): ~$0.03
- **Total**: ~$0.05 per image

**Batch of 3 images**: ~$0.15

## Key Features

### Full Traceability
Every step is logged and displayed:
- Original content → Intent → Enhanced prompt → Final image
- LLM reasoning at each iteration
- Confidence scores and quality assessments
- Processing times for each stage

### Debugging Capabilities
- View exact prompt sent to Nano Banana
- See how Gemini 2.5 Flash refined the prompt
- Inspect iteration-by-iteration improvements
- Identify which sections generated best images

### Educational Value
- Understand how LLM-guided prompt engineering works
- See the transformation from simple intent to detailed prompt
- Learn what makes prompts effective for Nano Banana
- Observe self-critique and refinement process

## Future Enhancements

### Phase 2 Features (Not Yet Implemented)
- **Image Critique with Vision**: Use Gemini 2.5 Flash Vision to analyze generated images and provide feedback for re-generation
- **Real-time Streaming**: WebSocket updates during long-running pipelines
- **Batch Processing**: Generate all blog images in one click
- **A/B Testing**: Generate multiple variations and compare
- **Quality Scoring**: Automatic assessment of final images
- **Export**: Download complete audit report as JSON/PDF

### Phase 3 Ideas
- **Content Suggestions**: AI recommends where images would improve readability
- **Style Transfer**: Apply consistent visual style across all blog images
- **Accessibility**: Generate alt text descriptions automatically
- **SEO Optimization**: Suggest image filenames and captions

## Technical Notes

### Why Separate Enhancement and Generation?
- **Modularity**: Can test enhancement without generating images
- **Cost Control**: Enhancement is cheaper than generation
- **Iteration Speed**: Refine prompts quickly before expensive image generation
- **Debugging**: Isolate issues to specific pipeline stages

### Why Gemini 2.5 Flash for Enhancement?
- **Speed**: 2-3s per iteration vs 10-20s with larger models
- **Cost**: ~$0.02 per image vs $0.10+ with GPT-4/Claude
- **Quality**: Sufficient for prompt optimization task
- **Availability**: Accessible via OpenRouter

### Why Nano Banana for Images?
- **Quality**: Magazine-grade, photorealistic output
- **Speed**: 8-12s per image
- **Cost**: ~$0.03 per image
- **Optimization**: Works well with detailed, paragraph-style prompts

## Troubleshooting

### "Failed to load blog posts"
- Check `/content/blog/` directory exists
- Ensure MDX files have valid frontmatter
- Verify file permissions

### "Pipeline execution failed"
- Check `OPENROUTER_API_KEY` environment variable
- Verify Gemini 2.5 Flash model is available
- Check API rate limits

### "Image generation failed"
- Ensure `public/generated/images/` directory exists and is writable
- Check Nano Banana model availability
- Review enhanced prompt for any issues

### Images not displaying
- Verify image was saved to `/public/generated/images/`
- Check browser console for 404 errors
- Ensure proper permissions on public directory

## Usage Tips

1. **Start Small**: Test with 1 blog post first
2. **Review Iterations**: Check if prompts improve across iterations
3. **Compare Outputs**: Select different blog posts to see variety
4. **Monitor Costs**: Each full pipeline execution costs ~$0.15 (3 images)
5. **Adjust Limits**: Modify the `slice(0, 3)` in pipeline route to process more/fewer sections

## Related Files

- Image Generation Agent: `/lib/agents/image-generation-agent/`
- Prompt Enhancement: `/lib/agents/prompt-enhancement/`
- Simpler Debug UI: `/app/debug/image-generation/page.tsx` (prompt-only testing)
- Test Scripts: `/scripts/test-llm-enhanced-generation.ts`
