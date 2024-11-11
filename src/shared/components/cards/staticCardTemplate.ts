import { Resvg, type ResvgRenderOptions } from "@resvg/resvg-js";
import { AttachmentBuilder } from "discord.js";

const createTemplateCard = async (serverIcon: string, whiteText: string, blueText: string) => {
    // Server Image 
    const serverIconImageSize = 96;

    // edit this to move image
    const serverIconCX = 80;
    const serverIconCY = 65;

    // formule for mask
    const serverIconX = serverIconCX - serverIconImageSize / 2;
    const serverIconY = serverIconCY - serverIconImageSize / 2;

    // White text - name 
    let whiteTextFontSize = 72;
    let whiteTextY = 25;
    
    if (whiteText.length >= 16) {
        whiteTextFontSize = 48;
        whiteTextY = 20
    }

    // const width = (400 / 10) * whiteText.length 
    const width = whiteText.length * whiteTextFontSize * 0.6;
    
    const svg = `<svg width="${135 * blueText.length}" height="380" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/svg">
     <!-- Grey rounded bg -->
        <path d="M0 96c0-33.603 0-50.405 6.54-63.24A60 60 0 0 1 32.76 6.54C45.596 0 62.398 0 96 0h${width + 39}.5c4.178 0 6.268 0 8.032.104 30.357 1.79 54.574 26.007 56.364 56.364.104 1.764.104 3.854.104 8.032s0 6.268-.104 8.032c-1.79 30.357-26.007 54.574-56.364 56.364-1.764.104-3.854.104-8.032.104H0V96Z" 
        fill="#1A1B1E"/>
    <!-- Serverio/User Icon -->
         <defs>
            <mask id="circleMask">
            <circle cx="${serverIconCX}" cy="${serverIconCY}" r="${serverIconImageSize / 2}" fill="white"/>
            </mask>
        </defs>
        <image
            href="${serverIcon}"
            x="${serverIconX}" y="${serverIconY}" 
            width="${serverIconImageSize}" height="${serverIconImageSize}"
            mask="url(#circleMask)"
        />
    <!-- Baltas Tekstas -->    
        <text font-family="UniSansHeavy" x="${serverIconCX + 70}" y="${serverIconCY + whiteTextY}" font-size="${whiteTextFontSize}" fill="#ffff">${whiteText}</text>
    <!-- Mėlynas Tekstas -->    
        <defs>
            <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" /> <!-- Adjust blur here -->
            <feOffset dx="5" dy="5" result="offsetblur" /> <!-- Adjust offset here -->
            <feFlood flood-color="rgba(0, 0, 0, 0.5)" /> <!-- Shadow color -->
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" /> <!-- This ensures the text is drawn above the shadow -->
            </feMerge>
            </filter>
        </defs>
        <text fill="#5865F2" font-family="UniSansHeavy" x="-20" y="320" font-size="232" filter="url(#drop-shadow)">${blueText}</text>
    </svg>
    `;

    const opts: ResvgRenderOptions = {
        // logLevel: 'debug',
        font: {
            loadSystemFonts: false,
            fontFiles: ['./src/assets/fonts/UniSansHeavy.otf']
        },
    }

    const resvg = new Resvg(svg, opts);

    const resolved = await Promise.all(
        resvg.imagesToResolve().map(async (url) => {
          const img = await fetch(url)
          const buffer = await img.arrayBuffer()
          return {
            url,
            buffer: Buffer.from(buffer),
          }
        }),
      )
      if (resolved.length > 0) {
        for (const result of resolved) {
          const { url, buffer } = result
          resvg.resolveImage(url, buffer)
        }
    }
    
    const pngData = resvg.render()
    const pngBuffer = pngData.asPng();

    const name = Date.now().toString(36)

    const imageAttachment = new AttachmentBuilder(pngBuffer, { name: `${name}.png` });
    return imageAttachment;
}

export default createTemplateCard;

