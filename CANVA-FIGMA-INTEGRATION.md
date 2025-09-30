# Canva & Figma API Integration Guide

## Overview

Both Canva and Figma offer APIs for programmatic design generation. Here's the strategic comparison:

| Feature | Canva API | Figma API | Winner |
|---------|-----------|-----------|--------|
| **Ease of Use** | ⭐⭐⭐⭐⭐ Simple REST API | ⭐⭐⭐ More complex | Canva |
| **Design Templates** | 1M+ ready templates | Must create your own | Canva |
| **Cost** | $120-300/year | Free | Figma |
| **Brand Control** | Good (with Brand Kit) | Excellent (full control) | Figma |
| **Automation** | Built for automation | Requires more setup | Canva |
| **Collaboration** | Good | Excellent | Figma |
| **Export Quality** | PNG/PDF/MP4 | PNG/SVG/PDF | Tie |

**Recommendation: Use BOTH**
- **Canva**: Quick blog OG images, social media graphics (speed)
- **Figma**: Brand assets, design system, precise control (quality)

---

## Part 1: Canva API Integration

### Canva Connect API (Recommended for Automation)

Canva offers two APIs:
1. **Public API** (free, limited) - read-only
2. **Connect API** ($120-300/year) - full automation ← **This is what you want**

### Step 1: Canva Setup

```bash
# 1. Go to Canva Apps: https://www.canva.com/developers/apps
# 2. Create new app
# 3. Enable "Connect API" scope
# 4. Get Client ID and Client Secret
# 5. Add to .env
```

```env
CANVA_CLIENT_ID=your_client_id
CANVA_CLIENT_SECRET=your_client_secret
CANVA_REDIRECT_URI=http://localhost:3000/api/canva/callback
```

### Step 2: Create Brand Template in Canva

**Manual steps (one-time):**

1. Open Canva → Create Design → Custom Size (1200 x 630 px)
2. Add your brand elements:
   - Background gradient (your brand colors)
   - Logo placement
   - Text boxes for dynamic content
   - Category badge
3. Tag elements you want to be dynamic:
   - Click element → "More" → "Set up autofill"
   - Name it: `{{title}}`, `{{category}}`, `{{platform_icon}}`
4. Save as Template
5. Get Template ID from URL

**Your template URL will look like:**
```
https://www.canva.com/design/ABCD1234/edit
                              ^^^^^^^^
                            Template ID
```

### Step 3: Install Canva SDK

```bash
npm install @canva/connect-api-ts
```

### Step 4: Implementation

```typescript
// lib/canva/client.ts
import { CanvaClient } from '@canva/connect-api-ts';

export const canvaClient = new CanvaClient({
  clientId: process.env.CANVA_CLIENT_ID!,
  clientSecret: process.env.CANVA_CLIENT_SECRET!,
  redirectUri: process.env.CANVA_REDIRECT_URI!,
});

// One-time OAuth flow (do this once, store tokens)
export async function authenticateCanva() {
  // 1. Get authorization URL
  const authUrl = canvaClient.getAuthorizationUrl({
    scopes: ['design:content:write', 'design:content:read'],
    state: 'random_state_string',
  });

  console.log('Visit this URL:', authUrl);

  // 2. User visits URL, authorizes, redirects back with code
  // 3. Exchange code for tokens
  // (Do this in your app's callback route)
}
```

```typescript
// scripts/generate-canva-images.ts
import { canvaClient } from '@/lib/canva/client';
import { blog } from '#site/content';
import fs from 'fs';
import axios from 'axios';

const CANVA_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // From step 2

async function generateBlogImageWithCanva(post: BlogPost) {
  try {
    // 1. Create design from template with autofill
    const design = await canvaClient.design.create({
      design_type: 'SocialPost',
      asset_id: CANVA_TEMPLATE_ID,
      title: `OG Image - ${post.title}`,
    });

    // 2. Autofill template fields
    await canvaClient.design.autofill.create({
      design_id: design.design.id,
      data: {
        title: post.title,
        category: post.category,
        platform_icon: post.tags[0], // "LinkedIn", "TikTok", etc.
      },
    });

    // 3. Export as PNG
    const exportJob = await canvaClient.export.create({
      design_id: design.design.id,
      format: 'png',
      pages: [1],
      quality: 'high',
    });

    // 4. Wait for export to complete
    let exportStatus = await canvaClient.export.get({
      export_id: exportJob.job.id,
    });

    while (exportStatus.job.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      exportStatus = await canvaClient.export.get({
        export_id: exportJob.job.id,
      });
    }

    // 5. Download the image
    const imageUrl = exportStatus.job.urls![0].url;
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // 6. Save locally
    const filename = `${post.slugAsParams}-og.png`;
    const filepath = `public/images/blog/${filename}`;
    fs.writeFileSync(filepath, buffer);

    console.log(`✅ Generated: ${filepath}`);

    return `/images/blog/${filename}`;
  } catch (error) {
    console.error(`❌ Failed to generate image for ${post.title}:`, error);
    return null;
  }
}

// Generate for all blog posts
async function generateAllBlogImages() {
  console.log('🎨 Starting Canva image generation...');

  for (const post of blog) {
    if (!post.og?.image || post.og.image.includes('placeholder')) {
      console.log(`\nGenerating for: ${post.title}`);
      const imagePath = await generateBlogImageWithCanva(post);

      if (imagePath) {
        // Optionally: Update frontmatter programmatically
        console.log(`Image saved: ${imagePath}`);
      }
    } else {
      console.log(`⏭️  Skipping ${post.title} (already has image)`);
    }
  }

  console.log('\n✨ All done!');
}

generateAllBlogImages();
```

### Step 5: Add to package.json

```json
{
  "scripts": {
    "generate:images:canva": "tsx scripts/generate-canva-images.ts"
  }
}
```

### Step 6: Run It

```bash
npm run generate:images:canva
```

**Expected output:**
```
🎨 Starting Canva image generation...

Generating for: Why LinkedIn is Essential for B2B Companies
✅ Generated: public/images/blog/linkedin-business-guide-when-to-use-og.png

Generating for: TikTok for Business: When It Works
✅ Generated: public/images/blog/tiktok-business-guide-when-to-use-og.png

... (12 more)

✨ All done!
```

### Canva Pro Tips

**1. Create Multiple Templates for Variety**
```typescript
const TEMPLATES = {
  guide: 'TEMPLATE_ID_1',
  case_study: 'TEMPLATE_ID_2',
  technical: 'TEMPLATE_ID_3',
};

const templateId = TEMPLATES[post.category.toLowerCase()] || TEMPLATES.guide;
```

**2. Use Brand Kit for Consistency**
- Canva Brand Kit ensures colors, fonts, logos are consistent
- Access via: Canva → Your Brand → Brand Kit
- API automatically uses your brand assets

**3. Batch Operations**
```typescript
// Generate all images in parallel
const promises = blog.map(post => generateBlogImageWithCanva(post));
await Promise.all(promises);
```

**4. Error Handling & Retries**
```typescript
async function generateWithRetry(post: BlogPost, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateBlogImageWithCanva(post);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}
```

---

## Part 2: Figma API Integration

### Why Figma?

**Best for:**
- ✅ Precise brand control
- ✅ Version control for designs
- ✅ Collaboration with designers
- ✅ Design systems
- ✅ Free API access

**Figma REST API** lets you:
- Read file structure and styles
- Export images programmatically
- Sync design tokens

**Note**: Figma API is read-only. You design in Figma UI, then export via API.

### Step 1: Figma Setup

1. **Create Figma account** (free)
2. **Get Personal Access Token**:
   - Account Settings → Personal Access Tokens → Generate new token
   - Save it: `figpat_XXXXXXXXXXXX`

3. **Create design file**:
   - New Design File → Custom size (1200 x 630 px)
   - Design your OG image template
   - Use components for reusability

4. **Set up variants** (key feature):
   - Create component with variants for different platforms
   - Properties: Platform (LinkedIn, TikTok, Facebook, etc.)
   - Auto-swap icons, colors per variant

5. **Get File Key**:
   - File URL: `https://www.figma.com/file/ABCD1234/OG-Images`
   - File key: `ABCD1234`

### Step 2: Install Figma SDK

```bash
npm install figma-api axios sharp
```

### Step 3: Implementation

```typescript
// lib/figma/client.ts
import Figma from 'figma-api';

export const figmaClient = new Figma.Api({
  personalAccessToken: process.env.FIGMA_TOKEN!,
});

export const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY!;
export const FIGMA_NODE_ID = process.env.FIGMA_NODE_ID!; // Frame/Component to export
```

```typescript
// scripts/generate-figma-images.ts
import { figmaClient, FIGMA_FILE_KEY, FIGMA_NODE_ID } from '@/lib/figma/client';
import { blog } from '#site/content';
import axios from 'axios';
import fs from 'fs';
import sharp from 'sharp';

async function generateBlogImageWithFigma(post: BlogPost) {
  try {
    // 1. Get Figma file
    const file = await figmaClient.getFile(FIGMA_FILE_KEY);

    // 2. Find the component/frame you want to export
    // You can search by name or use node ID
    const nodeId = FIGMA_NODE_ID; // Your template frame

    // 3. Export as PNG
    const imageResp = await figmaClient.getImage(FIGMA_FILE_KEY, {
      ids: nodeId,
      format: 'png',
      scale: 2, // 2x for retina
    });

    const imageUrl = imageResp.images[nodeId];

    // 4. Download image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    let buffer = Buffer.from(response.data);

    // 5. Add text overlay using sharp (since Figma export is static)
    buffer = await sharp(buffer)
      .composite([
        {
          input: Buffer.from(
            `<svg width="1200" height="630">
              <style>
                .title { fill: white; font-size: 60px; font-family: Inter; font-weight: bold; }
                .category { fill: #10b981; font-size: 20px; font-family: Inter; }
              </style>
              <text x="80" y="250" class="title">${wrapText(post.title, 35)}</text>
              <text x="80" y="550" class="category">${post.category}</text>
            </svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    // 6. Save
    const filename = `${post.slugAsParams}-og.png`;
    const filepath = `public/images/blog/${filename}`;
    fs.writeFileSync(filepath, buffer);

    console.log(`✅ Generated: ${filepath}`);

    return `/images/blog/${filename}`;
  } catch (error) {
    console.error(`❌ Failed:`, error);
    return null;
  }
}

function wrapText(text: string, maxLength: number): string {
  // Simple text wrapping (you'd want better logic in production)
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine);
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.join('\n');
}
```

### Step 4: Advanced Figma Approach - Design Tokens

**Better approach**: Use Figma as design system source of truth

```typescript
// scripts/sync-figma-design-tokens.ts
import { figmaClient, FIGMA_FILE_KEY } from '@/lib/figma/client';
import fs from 'fs';

async function syncDesignTokens() {
  const file = await figmaClient.getFile(FIGMA_FILE_KEY);

  // Extract colors from Figma styles
  const styles = await figmaClient.getFileStyles(FIGMA_FILE_KEY);

  const colors: Record<string, string> = {};

  for (const [key, style] of Object.entries(styles.meta.styles)) {
    if (style.style_type === 'FILL') {
      // Get actual color value
      const node = findNodeById(file.document, style.node_id);
      if (node && node.fills && node.fills[0]) {
        const fill = node.fills[0];
        const { r, g, b, a } = fill.color;
        colors[style.name] = rgbaToHex(r, g, b, a);
      }
    }
  }

  // Save to your design system
  fs.writeFileSync(
    'lib/design-system/figma-tokens.json',
    JSON.stringify({ colors }, null, 2)
  );

  console.log('✅ Design tokens synced from Figma');
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
```

### Figma Pro Tips

**1. Use Figma Variants for Templates**

Instead of multiple files, use one file with variants:
```typescript
const variant = {
  'Platform': post.tags[0], // "LinkedIn", "TikTok", etc.
  'Theme': 'Dark', // or "Light"
};

// Find variant in Figma component
const variantNodeId = findVariantNode(file, 'OGImage', variant);
```

**2. Automate with GitHub Actions**

```yaml
# .github/workflows/sync-figma.yml
name: Sync Figma Designs

on:
  schedule:
    - cron: '0 0 * * 1' # Weekly
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Sync design tokens
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
        run: npm run sync:figma
      - name: Commit changes
        run: |
          git add .
          git commit -m "Sync Figma design tokens" || exit 0
          git push
```

**3. Figma-to-Code Plugins**

Use plugins that export designs as code:
- **Anima**: Figma → React components
- **Builder.io**: Visual CMS + Figma integration
- **Quest**: Figma → Clean React code

---

## Part 3: Hybrid Workflow (Best of Both Worlds)

### Recommended Setup

**Figma**: Design system & brand assets
- Brand colors, typography, spacing
- Component library
- Icon system
- Master templates

**Canva**: Production image generation
- Blog OG images (fast, automated)
- Social media graphics (templates + API)
- Marketing materials (quick iterations)

**Workflow:**

1. **Design in Figma** (designers work here)
   - Create master OG image template
   - Define brand styles
   - Export as PNG for reference

2. **Recreate in Canva** (for automation)
   - Match Figma design in Canva template
   - Use same colors, fonts, layouts
   - Set up autofill fields

3. **Automate with Canva API**
   - Generate blog images programmatically
   - Export at scale
   - Maintain brand consistency

4. **Sync Design Tokens** (keep in sync)
   - Figma → JSON design tokens
   - Update Canva brand kit when Figma changes

### Example Implementation

```typescript
// scripts/generate-images-hybrid.ts
import { syncFigmaDesignTokens } from './figma-sync';
import { updateCanvaBrandKit } from './canva-sync';
import { generateBlogImagesWithCanva } from './canva-generate';

async function hybridImageGeneration() {
  // Step 1: Sync design tokens from Figma
  console.log('📐 Syncing design tokens from Figma...');
  const tokens = await syncFigmaDesignTokens();

  // Step 2: Update Canva brand kit (if tokens changed)
  if (tokens.changed) {
    console.log('🎨 Updating Canva brand kit...');
    await updateCanvaBrandKit(tokens);
  }

  // Step 3: Generate images with Canva
  console.log('🚀 Generating blog images with Canva...');
  await generateBlogImagesWithCanva();

  console.log('✨ All done!');
}

hybridImageGeneration();
```

---

## Part 4: Cost Breakdown

### Canva Connect API Pricing

| Plan | Cost | Images/Month | Cost per Image |
|------|------|--------------|----------------|
| **Starter** | $120/year | Unlimited | $0 |
| **Growth** | $190/year | Unlimited | $0 |
| **Scale** | $300/year | Unlimited | $0 |

**Difference**: API rate limits and advanced features

**Recommended**: Start with Starter ($10/month effectively)

### Figma Pricing

| Plan | Cost | Features |
|------|------|----------|
| **Free** | $0 | 3 files, unlimited exports |
| **Professional** | $12/month | Unlimited files |

**For image generation**: Free plan is sufficient (1 file for OG templates)

### Total Cost Comparison

| Approach | Monthly Cost | Setup Time | Maintenance |
|----------|--------------|------------|-------------|
| **Canva API Only** | $10 | 2 hours | Low |
| **Figma API Only** | $0 | 5 hours | Medium |
| **Hybrid (Figma + Canva)** | $10 | 4 hours | Low |
| **Manual Figma** | $0 | N/A | High |
| **DALL-E 3** | $0.16/post | 1 hour | Low |

**Best value**: Canva API ($10/month) or DALL-E 3 ($0.64/month for 4 posts)

---

## Part 5: Quick Start Checklist

### Option A: Canva API (Easiest)

- [ ] Sign up for Canva Pro ($12.99/month, includes Connect API)
- [ ] Create API app at https://www.canva.com/developers
- [ ] Design 1-2 OG image templates in Canva
- [ ] Add autofill fields ({{title}}, {{category}})
- [ ] Install `@canva/connect-api-ts`
- [ ] Implement generation script
- [ ] Run for all 14 blog posts
- [ ] Add to CI/CD for new posts

**Time to first image: 2-3 hours**

### Option B: Figma API (Free)

- [ ] Sign up for Figma (free)
- [ ] Get Personal Access Token
- [ ] Design OG image template in Figma
- [ ] Create component variants for platforms
- [ ] Install `figma-api`
- [ ] Implement export script
- [ ] Add text overlay logic (sharp)
- [ ] Run for all 14 blog posts

**Time to first image: 4-6 hours**

### Option C: Hybrid (Best)

- [ ] Set up Figma (free) as design source
- [ ] Set up Canva ($10/month) for automation
- [ ] Sync design tokens Figma → Canva
- [ ] Generate images via Canva API
- [ ] Automate for new posts

**Time to first image: 3-4 hours**

---

## Recommendation for OmniSignalAI

**Phase 1 (This Week)**:
→ **Use DALL-E 3** ($0.56 for all 14 posts)
- Fastest to implement (already have OpenAI account probably)
- No design work needed
- Good enough quality
- Can switch later

**Phase 2 (Next Month)**:
→ **Evaluate Canva API** (free trial)
- Test with 5-10 images
- If quality good → migrate all
- If quality issues → stick with DALL-E

**Phase 3 (Month 3)**:
→ **Add Figma** for brand assets
- Design system documentation
- Icon library
- Marketing assets
- Not for blog automation (too slow)

**Long-term**:
- Canva API for blog images (speed)
- Figma for design system (control)
- DALL-E for hero images (uniqueness)

**Start simple, iterate based on results.**