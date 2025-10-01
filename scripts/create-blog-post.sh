#!/bin/bash

# Blog Post Creation Script
# Usage: ./scripts/create-blog-post.sh "my-post-slug" "My Post Title"

SLUG=$1
TITLE=$2

if [ -z "$SLUG" ] || [ -z "$TITLE" ]; then
  echo "Usage: ./scripts/create-blog-post.sh \"slug\" \"Post Title\""
  exit 1
fi

DATE=$(date +"%Y-%m-%d")
TIMESTAMP=$(date +"%Y-%m-%dT%H:%M:%SZ")
FILE_PATH="content/blog/${SLUG}.mdx"

if [ -f "$FILE_PATH" ]; then
  echo "Error: Blog post already exists at $FILE_PATH"
  exit 1
fi

cat > "$FILE_PATH" << 'EOF'
---
title: ${TITLE}
description: >-
  [REQUIRED] Write a compelling 150-160 character description that includes your primary keyword. This appears in search results.
datePublished: '${TIMESTAMP}'
dateModified: '${TIMESTAMP}'
keywords:
  - [primary keyword]
  - [secondary keyword]
  - [long-tail keyword 1]
  - [long-tail keyword 2]
  - [related keyword]
category: Guides
tags:
  - AI
  - Social Media
  - Content Creation
featured: false
draft: true
schema: HowTo
faq:
  - q: [Most common question about this topic]?
    a: >-
      [Clear, concise answer with specific details. This targets featured snippets and LLM citations.]
  - q: [Second common question]?
    a: >-
      [Answer with data/numbers if possible. LLMs love concrete information.]
  - q: [Third question focusing on ROI/results]?
    a: >-
      [Answer emphasizing measurable outcomes.]
steps:
  - name: [Step 1 Title]
    description: >-
      [Clear description of what this step accomplishes. Be specific.]
  - name: [Step 2 Title]
    description: >-
      [What the user should do in this step.]
  - name: [Step 3 Title]
    description: >-
      [Final step with expected outcome.]
author:
  name: OmniSignalAI Team
  url: https://omnisignalai.com/about
  image: /images/team-avatar.png
thumbnail: /generated/images/blog-${SLUG}.png
og:
  image: /generated/images/blog-${SLUG}.png
  imageAlt: ${TITLE}
---

## Quick Answer

[2-3 sentences that directly answer the main question. This is what LLMs will cite.]

Example:
"AI tools can generate 30 days of social content in 30 minutes compared to 4+ hours manually. This guide shows the exact 3-step process: setup (5min), generation (15min), review (10min)."

## What You'll Learn

- [Specific, measurable outcome 1]
- [Specific, measurable outcome 2]
- [Specific, measurable outcome 3]
- [Specific, measurable outcome 4]

## [Primary H2 - Include Main Keyword]

[Introduction paragraph establishing the problem or context]

[Supporting paragraph with specific data/statistics]

**Key insight:** [Highlight important point that's citation-worthy]

### [H3 Subheading - Include Long-tail Keyword]

[Detailed explanation]

**Example:**
```
[Real example with actual code/data/process]
```

## [Second Major H2 - Address Common Question]

[Content that directly answers a searcher's intent]

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Time | 8 hours | 30 min | 93.75% |
| Cost | $400 | $25 | $375 saved |
| Output | 30 posts | 30 posts | Same quality |

## Step-by-Step Guide

### 1. [First Step Title]

**What you need:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Process:**

| Step | Action | Time |
|------|--------|------|
| 1 | [Specific action] | 1min |
| 2 | [Specific action] | 2min |
| 3 | [Specific action] | 2min |

### 2. [Second Step Title]

[Detailed instructions with screenshots/examples]

**Pro tip:** [Actionable advice that demonstrates expertise]

### 3. [Third Step Title]

[Final step with validation/testing instructions]

## Real-World Results

### [Case Study 1 - Industry Type]
**Before:**
- Time: [specific number]
- Cost: [specific number]
- Challenge: [specific problem]

**After:**
- Time: [specific number]
- Cost: [specific number]
- Result: [specific outcome]
- **Savings: [calculate ROI]**

## Common Questions

### [Question targeting featured snippet]?

[Direct answer in first paragraph]

[Supporting details in second paragraph]

### [Another common question]?

[Clear, structured answer]

## Key Takeaways

- ✅ **[Main benefit with number]**: [Specific claim]
- ✅ **[Second benefit]**: [Specific claim]
- ✅ **Best for**: [Target audience description]
- ✅ **ROI**: [Specific financial or time savings]
- ✅ **Getting started**: [How easy it is to begin]

## Try It Yourself

[Call-to-action paragraph with low-friction next step]

[Start Free Trial →](/signup)

---

*Published: ${DATE} | Read time: [X] minutes | Category: [Category]*
EOF

# Replace template variables
sed -i "s/\${TITLE}/$TITLE/g" "$FILE_PATH"
sed -i "s/\${TIMESTAMP}/$TIMESTAMP/g" "$FILE_PATH"
sed -i "s/\${SLUG}/$SLUG/g" "$FILE_PATH"
sed -i "s/\${DATE}/$DATE/g" "$FILE_PATH"

echo "✅ Blog post created: $FILE_PATH"
echo ""
echo "Next steps:"
echo "1. Edit $FILE_PATH with your content"
echo "2. Fill in all [REQUIRED] fields"
echo "3. Replace all [placeholders] with actual content"
echo "4. Generate images: visit http://localhost:5000/debug/content-to-image-pipeline"
echo "5. Set draft: false when ready to publish"
