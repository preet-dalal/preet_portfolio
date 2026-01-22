import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface Props {
  content: string
  images: Record<string, string>
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}

export default function TeXRenderer({ content, images }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Prepend base URL to all image paths
    const basePath = import.meta.env.BASE_URL
    const processedImages: Record<string, string> = {}
    for (const [key, value] of Object.entries(images)) {
      // Remove leading slash and prepend base path
      processedImages[key] = `${basePath}${value.replace(/^\//, '')}`
    }

    const rendered = parseAndRender(content, processedImages)
    containerRef.current.innerHTML = rendered

    const mathElements = containerRef.current.querySelectorAll('[data-math]')
    mathElements.forEach((elem) => {
      const tex = elem.getAttribute('data-math')
      const isDisplay = elem.getAttribute('data-display') === 'true'

      try {
        katex.render(tex || '', elem as HTMLElement, {
          displayMode: isDisplay,
          throwOnError: false,
        })
      } catch (err) {
        console.error('KaTeX error:', err)
        elem.textContent = tex || ''
      }
    })
  }, [content, images])

  return <div ref={containerRef} className="space-y-4" />
}

function parseAndRender(texContent: string, images: Record<string, string>): string {
  let html = texContent
  const mathBlocks: { [key: string]: string } = {}
  let mathCounter = 0

  // PHASE 0: Handle texorpdfstring BEFORE math extraction (critical order)
  html = html.replace(/\\texorpdfstring\{[^}]*\}\{([^}]*)\}/g, '$1')

  // PHASE 1: Extract and preserve math
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{eqnarray\*?\}([\s\S]*?)\\end\{eqnarray\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\\begin\{multline\*?\}([\s\S]*?)\\end\{multline\*?\}/g, (match, math) => {
    const key = `__MATH_DISPLAY_${mathCounter}__`
    mathBlocks[key] = `<div class="my-6 overflow-x-auto" data-math="${math.trim()}" data-display="true"></div>`
    mathCounter++
    return key
  })

  html = html.replace(/\$([^$]+?)\$/g, (match, math) => {
    const key = `__MATH_INLINE_${mathCounter}__`
    mathBlocks[key] = `<span data-math="${math.trim()}" data-display="false"></span>`
    mathCounter++
    return key
  })

  // PHASE 2: Remove ALL document structure
  html = html.replace(/\\documentclass\{[^}]*\}/g, '')
  html = html.replace(/\\usepackage(?:\[[^\]]*\])?\{[^}]*\}/g, '')
  html = html.replace(/\\begin\{document\}/g, '')
  html = html.replace(/\\end\{document\}/g, '')
  html = html.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '')
  html = html.replace(/\\maketitle/g, '')
  html = html.replace(/\\begin\{table\*?\}[\s\S]*?\\end\{table\*?\}/g, '')
  html = html.replace(/\\begin\{tabular\}[^}]*\}[\s\S]*?\\end\{tabular\}/g, '')
  html = html.replace(/\\geometry\{[^}]*\}/g, '')
  html = html.replace(/\\pagestyle\{[^}]*\}/g, '')
  html = html.replace(/\\setcounter\{[^}]*\}\{[^}]*\}/g, '')
  html = html.replace(/\\renewcommand\{[^}]*\}\{[^}]*\}/g, '')
  
  // Remove figure-related LaTeX commands that might leak through
  html = html.replace(/\\centering/g, '')
  html = html.replace(/\\hfill/g, '')
  html = html.replace(/\\caption\{[^}]*\}/g, '')
  html = html.replace(/\\label\{[^}]*\}/g, '')
  html = html.replace(/\[H\]/g, '')
  html = html.replace(/\[h\]/g, '')
  html = html.replace(/\[t\]/g, '')
  html = html.replace(/\[b\]/g, '')
  html = html.replace(/\[htbp\]/g, '')
  html = html.replace(/\[!htbp\]/g, '')
  html = html.replace(/0\.48/g, '')  // Remove subfigure width values
  html = html.replace(/0\.\d+\\textwidth/g, '')

  // Remove comments
  html = html.replace(/%[^\n]*/g, '')
  html = html.replace(/^[^a-zA-Z0-9]*\n/gm, '')

  // PHASE 3: Extract title/author/date
  const titleMatch = html.match(/\\title\{([^}]+)\}/)
  const authorMatch = html.match(/\\author\{([^}]+)\}/)
  const dateMatch = html.match(/\\date\{([^}]+)\}/)

  let titleHtml = ''
  if (titleMatch) {
    titleHtml += `<h1 class="text-4xl font-bold mb-3 text-white">${escapeHtml(titleMatch[1])}</h1>\n`
  }
  if (authorMatch) {
    titleHtml += `<p class="text-base text-gray-400 mb-1">${escapeHtml(authorMatch[1])}</p>\n`
  }
  if (dateMatch) {
    titleHtml += `<p class="text-sm text-gray-500 mb-6">${escapeHtml(dateMatch[1])}</p>\n`
  }

  html = html.replace(/\\title\{[^}]*\}/g, '')
  html = html.replace(/\\author\{[^}]*\}/g, '')
  html = html.replace(/\\date\{[^}]*\}/g, '')
  html = html.replace(/\\today/g, '')

  // Handle footnotes - convert to parenthetical notes
  html = html.replace(/\\footnote\{([^}]+)\}/g, '<sup class="text-orange-400 cursor-help" title="$1">[*]</sup>')

  // PHASE 4: Convert structure
  html = html.replace(/\\section\*?\{([^}]+)\}/g, '<h2 class="text-3xl font-bold mt-10 mb-5 text-white border-b border-orange-500/50 pb-2">$1</h2>')
  html = html.replace(/\\subsection\*?\{([^}]+)\}/g, '<h3 class="text-2xl font-semibold mt-8 mb-4 text-gray-100">$1</h3>')
  html = html.replace(/\\subsubsection\*?\{([^}]+)\}/g, '<h4 class="text-xl font-semibold mt-6 mb-3 text-gray-200">$1</h4>')

  // PHASE 5: Text formatting
  html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
  html = html.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
  html = html.replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>')
  html = html.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>')
  html = html.replace(/\\textsl\{([^}]+)\}/g, '<em>$1</em>')
  html = html.replace(/\\textsc\{([^}]+)\}/g, '<span class="uppercase">$1</span>')
  html = html.replace(/\\textrm\{([^}]+)\}/g, '$1')
  html = html.replace(/\\textsf\{([^}]+)\}/g, '$1')

  // PHASE 5a: Handle complete figure environments FIRST
  html = html.replace(/\\begin\{figure\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{figure\}/g, (match, figContent) => {
    // Extract main caption if present - handle multi-line captions with balanced braces
    let caption = '';
    const captionStartMatch = figContent.match(/\\caption\{/);
    if (captionStartMatch) {
      const startIdx = figContent.indexOf('\\caption{') + 9;
      let braceCount = 1;
      let endIdx = startIdx;
      while (braceCount > 0 && endIdx < figContent.length) {
        if (figContent[endIdx] === '{') braceCount++;
        if (figContent[endIdx] === '}') braceCount--;
        endIdx++;
      }
      caption = figContent.substring(startIdx, endIdx - 1);
    }
    
    // Find all images in the figure
    const imageMatches: string[] = [];
    
    // Helper function to process caption with inline math
    const processCaptionMath = (captionText: string): string => {
      let processed = captionText;
      let counter = 0;
      const mathBlocks: { [key: string]: string } = {};
      processed = processed.replace(/\$([^$]+?)\$/g, (match, math) => {
        const key = `__CAP_MATH_${counter}__`;
        mathBlocks[key] = `<span data-math="${math.trim()}" data-display="false"></span>`;
        counter++;
        return key;
      });
      for (const [key, value] of Object.entries(mathBlocks)) {
        processed = processed.replace(key, value);
      }
      return processed;
    };
    
    // Helper function to find image URL
    const findImageUrl = (fileName: string): string | null => {
      const cleanFileName = fileName.split('/').pop()?.replace(/\s+/g, '') || fileName;
      for (const [key, url] of Object.entries(images)) {
        const keyBase = key.replace(/\.[^.]+$/, '').toLowerCase();
        const fileBase = cleanFileName.replace(/\.[^.]+$/, '').toLowerCase();
        if (key.toLowerCase() === cleanFileName.toLowerCase() || keyBase === fileBase) {
          return url;
        }
      }
      return null;
    };
    
    // Handle subfigures - improved regex to handle width specs like {0.48\textwidth}
    const subfigureRegex = /\\begin\{subfigure\}(?:\{[^}]*\\textwidth\})?([\s\S]*?)\\end\{subfigure\}/g;
    let subfigMatch;
    while ((subfigMatch = subfigureRegex.exec(figContent)) !== null) {
      const subfigContent = subfigMatch[1];
      const imgMatch = subfigContent.match(/\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^}]+)\}/);
      const subCaptionMatch = subfigContent.match(/\\caption\{([^}]*)\}/);
      
      if (imgMatch) {
        const url = findImageUrl(imgMatch[1]);
        if (url) {
          const subCaption = subCaptionMatch ? `<p class="text-sm text-gray-400 mt-2 text-center">${subCaptionMatch[1]}</p>` : '';
          imageMatches.push(`
            <div class="flex-1 min-w-[280px] max-w-[48%]">
              <img src="${url}" alt="${imgMatch[1]}" class="w-full h-auto rounded-lg" loading="lazy" />
              ${subCaption}
            </div>
          `);
        } else {
          // Fallback: construct URL directly from the LaTeX path
          const fallbackUrl = `/assets/${imgMatch[1]}`;
          const subCaption = subCaptionMatch ? `<p class="text-sm text-gray-400 mt-2 text-center">${subCaptionMatch[1]}</p>` : '';
          imageMatches.push(`
            <div class="flex-1 min-w-[280px] max-w-[48%]">
              <img src="${fallbackUrl}" alt="${imgMatch[1]}" class="w-full h-auto rounded-lg" loading="lazy" />
              ${subCaption}
            </div>
          `);
        }
      }
    }
    
    // Handle minipage environments (for 2x2 grids like in Project_3)
    const minipageRegex = /\\begin\{minipage\}(?:\[[^\]]*\])?\{[^}]*\}([\s\S]*?)\\end\{minipage\}/g;
    let minipageMatch;
    while ((minipageMatch = minipageRegex.exec(figContent)) !== null) {
      const minipageContent = minipageMatch[1];
      const imgMatch = minipageContent.match(/\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^}]+)\}/);
      const subCaptionMatch = minipageContent.match(/\\caption\*?\{([^}]*)\}/);
      
      if (imgMatch) {
        const url = findImageUrl(imgMatch[1]);
        if (url) {
          // Process the sub-caption with inline math
          const subCaption = subCaptionMatch ? `<p class="text-sm text-gray-400 mt-2 text-center">${processCaptionMath(subCaptionMatch[1])}</p>` : '';
          imageMatches.push(`
            <div class="w-[48%] min-w-[280px]">
              <img src="${url}" alt="${imgMatch[1]}" class="w-full h-auto rounded-lg" loading="lazy" />
              ${subCaption}
            </div>
          `);
        }
      }
    }
    
    // If no subfigures or minipages, look for direct includegraphics
    if (imageMatches.length === 0) {
      // Check for width specification to determine image size
      const directImgMatch = figContent.match(/\\includegraphics(?:\s*\[([^\]]*)\])?\s*\{([^}]+)\}/);
      if (directImgMatch) {
        const widthSpec = directImgMatch[1] || '';
        const imgPath = directImgMatch[2];
        const url = findImageUrl(imgPath);
        
        if (url) {
          // Parse width - if smaller than 0.7, use smaller class
          let sizeClass = 'max-w-3xl w-full';
          if (widthSpec.includes('0.48') || widthSpec.includes('0.5') || widthSpec.includes('0.6')) {
            sizeClass = 'max-w-md w-full';
          } else if (widthSpec.includes('0.4') || widthSpec.includes('0.3')) {
            sizeClass = 'max-w-sm w-full';
          }
          
          imageMatches.push(`<img src="${url}" alt="${imgPath}" class="${sizeClass} h-auto rounded-lg mx-auto" loading="lazy" />`);
        }
      }
    }
    
    if (imageMatches.length === 0) return '';
    
    // Process main caption to handle inline math  
    const processedCaption = processCaptionMath(caption);
    
    const captionHtml = processedCaption ? `<p class="text-sm text-gray-400 mt-4 text-center italic">${processedCaption}</p>` : '';
    
    // Use grid for 2x2 layouts (4 images)
    const layoutClass = imageMatches.length === 4 
      ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
      : 'flex flex-wrap gap-4 justify-center';
    
    return `
      <figure class="my-8">
        <div class="${layoutClass}">
          ${imageMatches.join('')}
        </div>
        ${captionHtml}
      </figure>
    `;
  });

  // Handle standalone images (outside figure environments)
  html = html.replace(/\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^}]+)\}/g, (match, imagePath) => {
    let fileName = imagePath.split('/').pop() || imagePath
    fileName = fileName.replace(/\s+/g, '')
    
    for (const [key, url] of Object.entries(images)) {
      if (key.toLowerCase() === fileName.toLowerCase() || key.includes(fileName)) {
        return `<img src="${url}" alt="${fileName}" class="max-w-full h-auto rounded-lg my-4" loading="lazy" />`
      }
    }
    return ''
  })

  // Lists - Fixed to properly capture all items
  html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
    // Split by \item and filter empty entries
    const itemParts = items.split(/\\item\s*/).filter((s: string) => s.trim());
    const listItems = itemParts
      .map((text: string) => {
        text = text.trim();
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        text = text.replace(/\\\\/g, ''); // Remove line breaks
        return `<li class="ml-4 mb-2 text-gray-200">• ${text}</li>`;
      })
      .join('');
    return `<ul class="my-4 space-y-1">${listItems}</ul>`;
  });

  html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
    // Split by \item and filter empty entries
    const itemParts = items.split(/\\item\s*/).filter((s: string) => s.trim());
    const listItems = itemParts
      .map((text: string, idx: number) => {
        text = text.trim();
        text = text.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
        text = text.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        text = text.replace(/\\\\/g, ''); // Remove line breaks
        return `<li class="ml-4 mb-2 text-gray-200">${idx + 1}. ${text}</li>`;
      })
      .join('');
    return `<ol class="my-4 space-y-1">${listItems}</ol>`;
  });

  // Handle dash/line separators
  html = html.replace(/^---+$/gm, '<hr class="my-6 border-gray-600" />');

  // Handle markdown-style bullet points (- text or - text \\)
  // This handles the MCMC Pipeline section format
  html = html.replace(/(?:^|\n)\s*-\s+([^\n\\]+)(?:\s*\\\\)?/g, (match, text) => {
    return `\n<li class="ml-4 mb-2 text-gray-200">• ${text.trim()}</li>`;
  });
  
  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, (match) => {
    return `<ul class="my-4 space-y-1">${match}</ul>`;
  });

  // AGGRESSIVE: Remove all remaining LaTeX
  html = html.replace(/\\[a-zA-Z]+(?:\{[^}]*\})?/g, '')
  html = html.replace(/\\[^a-zA-Z]/g, '')
  html = html.replace(/\{([^}]*)\}/g, '$1')
  html = html.trim()

  // Create paragraphs from line breaks
  const paragraphs = html
    .split(/\n\n+/)
    .map((para) => {
      para = para.trim()
      if (!para) return ''
      if (/^</.test(para)) return para
      const escaped = escapeHtml(para)
      return `<p class="mb-4 leading-relaxed text-gray-200">${escaped}</p>`
    })
    .filter((p) => p.length > 0)
    .join('')

  // Restore math blocks
  let result = titleHtml + paragraphs
  for (const [key, value] of Object.entries(mathBlocks)) {
    result = result.replace(new RegExp(escapeHtml(key), 'g'), value)
  }

  return result
}