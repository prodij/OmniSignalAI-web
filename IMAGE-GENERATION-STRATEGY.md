# Image Generation Strategy: Scalable Solutions for OmniSignalAI

## Current Image Needs Analysis

### Blog Posts (14 posts, currently 0 images)
- **Hero/Featured images**: 1 per post = 14 images (1200x630px recommended)
- **OG (Open Graph) images**: 1 per post = 14 images (1200x630px required for social sharing)
- **In-content images**: 2-4 per post = ~40 images (variable sizes)
- **Author avatars**: 1 default + potential contributors (150x150px)

### Website Assets (Current/Future)
- **Homepage hero**: 1 image (1920x1080px)
- **Section backgrounds**: 5-8 images
- **Feature icons/illustrations**: 10-15 images
- **Case study thumbnails**: Growing library
- **Product screenshots**: Dashboard mockups, UI examples
- **Social media graphics**: Ongoing need (varies by platform)

### Total Immediate Need: ~85 images
### Ongoing Monthly Need: 20-30 images (assuming 4 blog posts/month)

---

## The Scalable Image Generation Stack

### 🎯 Recommended Approach: Hybrid System

**Philosophy**: Use AI for speed + templates for consistency + manual for hero assets

---

## Option 1: Fully Automated AI Generation (Best for Scale)

### Primary Tool: Midjourney v6 or DALL-E 3

**Why this works:**
- Generates blog post OG images in 30 seconds
- Consistent style when using style parameters
- Can create variations rapidly
- Cost-effective at scale

**Setup:**
```bash
# Cost: $30/month (Midjourney) or $20/month (DALL-E via OpenAI)
# Output: 200-500 images/month
# Time per image: 30-60 seconds
```

**Workflow for Blog Posts:**

1. **Extract keywords from post**:
```typescript
// Add to velite.config.ts
const generateImagePrompt = (post: BlogPost) => {
  const platform = post.tags[0]; // "LinkedIn", "TikTok", etc.
  const theme = post.category; // "Guides", etc.

  return `Professional tech illustration, ${platform} social media platform,
  modern gradient background, blue and purple tones, clean geometric shapes,
  minimalist style, tech startup aesthetic, isometric view, --ar 1200:630 --v 6`;
};
```

2. **Batch generate via API**:
```typescript
// scripts/generate-blog-images.ts
import { OpenAI } from 'openai';
import { blog } from '#site/content';

const openai = new OpenAI();

async function generateBlogImages() {
  for (const post of blog) {
    if (!post.og?.image) {
      const prompt = generateImagePrompt(post);

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: "1792x1024",
        quality: "hd",
        n: 1,
      });

      // Download and save to public/images/blog/
      const imageUrl = response.data[0].url;
      await downloadImage(imageUrl, `public/images/blog/${post.slugAsParams}.png`);

      // Update frontmatter programmatically
      await updatePostFrontmatter(post.slug, {
        og: {
          image: `/images/blog/${post.slugAsParams}.png`,
          imageAlt: post.title
        }
      });
    }
  }
}
```

**Cost per blog post:**
- DALL-E 3: $0.04 per image (HD quality)
- Midjourney: ~$0.15 per image (included in $30/month plan)

**Pros:**
- ✅ Fully automated
- ✅ Unique images per post
- ✅ Can match brand style with consistent prompts
- ✅ Fast (30 sec per image)

**Cons:**
- ⚠️ Requires prompt engineering skill
- ⚠️ May need 2-3 generations to get right image
- ⚠️ Text in images often looks bad (use overlays instead)

---

## Option 2: Template-Based Generation (Best for Consistency)

### Primary Tool: Figma + Figma API or Bannerbear

**Why this works:**
- Perfect brand consistency
- Programmatic generation
- Variables ensure quality
- Text looks professional

**Setup:**

1. **Create Figma template** with variables:
   - Platform icon (dynamic)
   - Background gradient (brand colors)
   - Title text (dynamic)
   - Category badge (dynamic)

2. **Use Bannerbear or Figma API** to generate:

```typescript
// Using Bannerbear ($49/month, 500 images)
import { Bannerbear } from 'bannerbear';

const bb = new Bannerbear(process.env.BANNERBEAR_API_KEY);

async function generateOGImage(post: BlogPost) {
  const image = await bb.create_image({
    template: "blog_og_template_id",
    modifications: [
      {
        name: "title",
        text: post.title
      },
      {
        name: "category",
        text: post.category
      },
      {
        name: "platform_icon",
        image_url: `/images/icons/${post.tags[0].toLowerCase()}.svg`
      }
    ]
  });

  return image.image_url;
}
```

**Alternative: Canvas-based Node.js generation (Free)**

```typescript
// Using node-canvas (free, requires setup)
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function generateOGImage(post: BlogPost) {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#6366f1'); // Indigo
  gradient.addColorStop(1, '#8b5cf6'); // Purple
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 60px Inter';
  ctx.fillText(wrapText(post.title, 40), 80, 200);

  // Category badge
  ctx.fillStyle = '#10b981';
  ctx.fillRect(80, 480, 150, 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Inter';
  ctx.fillText(post.category, 90, 505);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/images/blog/${post.slugAsParams}.png`, buffer);
}
```

**Cost:**
- Bannerbear: $49/month for 500 images
- Figma API: Free (with Figma account)
- Node-canvas: Free (open source)

**Pros:**
- ✅ Perfect brand consistency
- ✅ Text looks professional
- ✅ Fast generation (2-5 seconds)
- ✅ Fully automated
- ✅ No AI weirdness

**Cons:**
- ⚠️ Less creative/unique
- ⚠️ Requires design setup time upfront
- ⚠️ Same template structure for all

---

## Option 3: Unsplash/Pexels + Overlay (Fastest to Start)

### Primary Tool: Unsplash API + Canvas overlays

**Why this works:**
- Free (for reasonable usage)
- High quality photos
- Can search by keyword
- Add text overlay programmatically

**Setup:**

```typescript
import { createApi } from 'unsplash-js';
import { createCanvas, loadImage } from 'canvas';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

async function generateBlogImage(post: BlogPost) {
  // Search for relevant photo
  const searchQuery = post.tags[0]; // "LinkedIn", "TikTok", etc.
  const result = await unsplash.search.getPhotos({
    query: `${searchQuery} technology business`,
    perPage: 1,
    orientation: 'landscape',
  });

  const photoUrl = result.response.results[0].urls.regular;

  // Download and add overlay
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Background photo (darkened)
  const bgImage = await loadImage(photoUrl);
  ctx.drawImage(bgImage, 0, 0, 1200, 630);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, 1200, 630);

  // Title overlay
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px Inter';
  const wrappedTitle = wrapText(post.title, 35);
  let y = 250;
  wrappedTitle.forEach(line => {
    ctx.fillText(line, 80, y);
    y += 70;
  });

  // Category badge
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(80, 520, 150, 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Inter';
  ctx.fillText(post.category, 95, 545);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/images/blog/${post.slugAsParams}.png`, buffer);

  // Unsplash requires attribution
  return {
    imageUrl: `/images/blog/${post.slugAsParams}.png`,
    credit: {
      photographer: result.response.results[0].user.name,
      url: result.response.results[0].user.links.html
    }
  };
}
```

**Cost:**
- Free (Unsplash API is free for reasonable usage)
- Node-canvas: Free

**Pros:**
- ✅ Free
- ✅ High quality photos
- ✅ Fast (5-10 seconds)
- ✅ Professional look

**Cons:**
- ⚠️ Need to add photo credits
- ⚠️ Less brand consistency
- ⚠️ May get generic stock photo look
- ⚠️ Search results can be hit-or-miss

---

## Option 4: Hybrid Approach (Recommended for Production)

**Use different tools for different image types:**

### For Blog OG Images: **Template-based (node-canvas)**
- Fast, consistent, professional
- Automated via build script
- Free
- No creative variation needed

### For Hero Images: **Midjourney/DALL-E**
- More visual impact
- Unique per post
- Worth the extra cost/time
- Manual curation for quality

### For Icons/Illustrations: **Figma + Manual**
- Brand consistency critical
- Design once, use forever
- Export as SVG

### For Screenshots: **Automated browser screenshots**
- Use Playwright/Puppeteer
- Auto-capture dashboard states
- Always up-to-date

---

## Implementation Roadmap

### Phase 1: Immediate (Week 1)
**Goal: Get OG images for all 14 existing blog posts**

```bash
# Create basic node-canvas script
npm install canvas
node scripts/generate-og-images.js
```

**Script to create:**
```typescript
// scripts/generate-og-images.ts
// - Read all blog posts from .velite/blog.json
// - For each post without og.image:
//   - Generate branded OG image (gradient + title + category)
//   - Save to public/images/blog/
//   - Update frontmatter (or regenerate with updated schema default)
```

**Time: 2-3 hours to build script, 2 minutes to generate all images**
**Cost: $0**

### Phase 2: Automation (Week 2)
**Goal: Auto-generate OG images on post creation**

```typescript
// Add to velite.config.ts transform
.transform(async (data) => {
  // Auto-generate OG image if not provided
  if (!data.og?.image) {
    const ogImage = await generateOGImage(data);
    data.og = {
      image: ogImage,
      imageAlt: data.title
    };
  }

  return {
    ...computedFields(data),
    readTime: data.readTime || calculatedReadTime,
    permalink: `/blog/${data.slug.split("/").slice(1).join("/")}`,
  };
})
```

**Time: 3-4 hours**
**Cost: $0**

### Phase 3: AI Hero Images (Week 3)
**Goal: Add unique hero images to posts**

**Decision point:**
- Budget available? → DALL-E 3 API ($0.04/image, high quality)
- Want full control? → Midjourney ($30/month, best quality)
- Bootstrap mode? → Unsplash + overlay (free)

**Recommended: Start with DALL-E 3**

```typescript
// scripts/generate-hero-images.ts
import OpenAI from 'openai';

const openai = new OpenAI();

async function generateHeroImage(post: BlogPost) {
  const prompt = `
    Professional illustration for business blog post about ${post.tags[0]}.
    Modern tech startup aesthetic, gradient background (indigo to purple),
    isometric 3D elements representing social media and connectivity,
    clean and minimal, bright and optimistic, high quality, 4K.
    Style: Dribbble top shots, tech illustration, SaaS marketing.
  `.trim();

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1792x1024", // 16:9 ratio, crop to 1200x630 for OG
    quality: "hd",
    n: 1,
  });

  const imageUrl = response.data[0].url;

  // Download, optimize (sharp), save
  await downloadAndOptimize(imageUrl, `public/images/blog/hero-${post.slugAsParams}.png`);

  return `/images/blog/hero-${post.slugAsParams}.png`;
}
```

**Time: 1 day to build + manually review first batch**
**Cost: $0.56 for all 14 posts (14 × $0.04)**

### Phase 4: Ongoing Automation (Week 4)
**Goal: New blog posts auto-generate images**

**Workflow:**
1. Write blog post MDX
2. Commit to repo
3. CI/CD pipeline:
   - Detects new post
   - Generates OG image (node-canvas, 5 sec)
   - Generates hero image (DALL-E, 30 sec)
   - Commits images back to repo
   - Triggers rebuild

**GitHub Actions workflow:**
```yaml
# .github/workflows/generate-blog-images.yml
name: Generate Blog Images

on:
  push:
    paths:
      - 'content/blog/**/*.mdx'

jobs:
  generate-images:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm install
          sudo apt-get install -y libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev
          npm install canvas sharp

      - name: Generate images
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          npm run generate:blog-images

      - name: Commit images
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add public/images/blog/*.png
          git commit -m "Generate blog images" || exit 0
          git push
```

---

## Cost Comparison

### Scenario: 14 existing posts + 4 new posts/month

| Approach | Setup Cost | Monthly Cost | Time/Image | Quality | Brand Consistency |
|----------|------------|--------------|------------|---------|-------------------|
| **DALL-E 3** | $0 | $0.16/post × 4 = $0.64 | 30 sec | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Midjourney** | $0 | $30 + $0/post = $30 | 30 sec | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **node-canvas** | 2 hrs | $0 | 5 sec | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Bannerbear** | 1 hr | $49 | 10 sec | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Unsplash** | 3 hrs | $0 | 10 sec | ⭐⭐⭐⭐ | ⭐⭐ |
| **Manual Figma** | N/A | $0 | 10 min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### Recommended Stack for OmniSignalAI:

**For OG Images (Social Sharing):**
→ **node-canvas** (free, fast, consistent)

**For Hero Images (Visual Impact):**
→ **DALL-E 3** initially, consider Midjourney if quality issues ($30/mo)

**For Website Assets (Icons, Illustrations):**
→ **Figma** (manual, one-time design)

**Total Monthly Cost: $0-30** (depending on hero image choice)
**Setup Time: 1-2 days**

---

## Code Implementation

### 1. Install Dependencies

```bash
npm install canvas sharp openai
npm install -D @types/node
```

### 2. Create Script Structure

```
scripts/
  ├── generate-images/
  │   ├── og-generator.ts        # Template-based OG images
  │   ├── hero-generator.ts      # AI hero images
  │   ├── utils.ts               # Image utilities (resize, optimize)
  │   └── index.ts               # Main orchestrator
  └── package.json               # Add scripts
```

### 3. Add npm Scripts

```json
{
  "scripts": {
    "generate:og-images": "tsx scripts/generate-images/og-generator.ts",
    "generate:hero-images": "tsx scripts/generate-images/hero-generator.ts",
    "generate:all-images": "tsx scripts/generate-images/index.ts"
  }
}
```

### 4. Update velite.config.ts

Add default OG image path:

```typescript
.transform((data) => {
  const ogImage = data.og?.image || `/images/blog/${data.slugAsParams}-og.png`;

  return {
    ...computedFields(data),
    og: {
      image: ogImage,
      imageAlt: data.og?.imageAlt || data.title
    },
    readTime: data.readTime || calculatedReadTime,
    permalink: `/blog/${data.slug.split("/").slice(1).join("/")}`,
  };
})
```

---

## Testing Strategy

### 1. Generate test images locally

```bash
npm run generate:og-images
```

### 2. Verify images

```bash
# Check all blog posts have images
ls -la public/images/blog/*.png

# Test OG image in social media debuggers
# - Facebook: https://developers.facebook.com/tools/debug/
# - Twitter: https://cards-dev.twitter.com/validator
# - LinkedIn: https://www.linkedin.com/post-inspector/
```

### 3. Optimize images

```bash
# Use sharp to optimize
npm install sharp
node scripts/optimize-images.js
```

---

## Metrics to Track

1. **Generation success rate**: % of posts with images
2. **Average generation time**: Seconds per image
3. **Social share CTR**: Before/after adding OG images
4. **Cost per image**: Monthly spend / images generated
5. **Manual intervention rate**: % requiring human review

---

## Future Enhancements

### Short-term (1-3 months)
- [ ] A/B test AI vs template OG images (CTR)
- [ ] Add image variations (light/dark mode)
- [ ] Generate social media post images (Instagram, Twitter, LinkedIn sizes)
- [ ] Implement image caching/CDN

### Medium-term (3-6 months)
- [ ] Train custom AI model on brand style
- [ ] Add video thumbnail generation
- [ ] Implement dynamic OG images (with query params)
- [ ] Build internal image library/asset management

### Long-term (6-12 months)
- [ ] Fully automated visual content pipeline
- [ ] AI-generated product screenshots
- [ ] Interactive image generation (users can customize)
- [ ] Real-time social media image generation

---

## Decision Matrix

**Choose node-canvas if:**
- ✅ You want $0 cost
- ✅ Brand consistency is #1 priority
- ✅ You're comfortable with code
- ✅ Templates are acceptable

**Choose DALL-E 3 if:**
- ✅ You want unique images per post
- ✅ $1-2/month is acceptable
- ✅ Visual creativity matters
- ✅ You want fast implementation

**Choose Midjourney if:**
- ✅ Visual quality is critical
- ✅ $30/month is acceptable
- ✅ You have time to curate outputs
- ✅ You want best-in-class AI images

**Choose Figma/Bannerbear if:**
- ✅ You have design resources
- ✅ You need template variations
- ✅ $50/month is acceptable
- ✅ You want designer-friendly workflow

---

## Recommended Next Steps

1. **This week**: Implement node-canvas OG image generator → Get all 14 posts with images
2. **Next week**: Test DALL-E 3 for 3-5 hero images → Evaluate quality
3. **Week 3**: If DALL-E works, automate for all posts. If not, stick with node-canvas only.
4. **Week 4**: Add GitHub Actions automation for new posts

**Start simple, iterate based on results.**